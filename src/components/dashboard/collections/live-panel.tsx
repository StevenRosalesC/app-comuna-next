'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ArrowLeft,
  DollarSign,
  Megaphone,
  UserPlus,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Heart,
  PiggyBank,
  User,
  Home,
  MapPin,
  Volume2,
  Users,
  Star,
  Check,
  Building2,
  FileText,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collections';
import { neighborhoodsService, Neighborhood } from '@/services/neighborhoods';
import { getMembers } from '@/services/members';
import { Contribution } from '@/interfaces/collections';
import { Member } from '@/interfaces/members';
import { PayContributionDialog } from './pay-contribution-dialog';
import { ExternalContributionDialog } from './external-contribution-dialog';
import { CloseCollectionDialog } from './close-collection-dialog';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidModules, ValidActions } from '@/constants/permissions';

interface UnifiedComuneroItem {
  key: string;
  isExternal: boolean;
  memberId: string | null;
  contributionId: string; // Guaranteed UUID
  hasExistingContribution: boolean;
  member: Member | null;
  person: any;
  fullName: string;
  identification: string;
  houseNumber: string;
  neighborhoodName: string;
  neighborhoodId: string;
  isSenior: boolean;
  isDisability: boolean;
  isBeneficiary: boolean;
  suggestedAmount: number;
  paidAmount: number;
  contributionStatus: 'PENDING' | 'PAID' | 'ANNOUNCED' | 'EXONERATED';
  notes: string;
  paidAt?: string;
  announcedAt?: string;
  rawContribution: Contribution | null;
}

function isSeniorCitizen(birthDate?: string | Date): boolean {
  if (!birthDate) return false;
  try {
    const dob = new Date(birthDate);
    if (isNaN(dob.getTime())) return false;
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 65;
  } catch {
    return false;
  }
}

/**
 * Normalizes contribution object across various backend naming styles (camelCase / snake_case)
 */
function normalizeContribution(c: any, defaultCollectionId: string = ''): Contribution {
  if (!c) return c;
  const contributionId = c.contributionId || c.contribution_id || c.id || '';
  const collectionId = c.collectionId || c.collection_id || defaultCollectionId;
  const memberId =
    c.memberId ?? c.member_id ?? c.member?.memberId ?? c.member?.member_id ?? c.member?.id ?? null;
  const isExternal = Boolean(c.isExternal ?? c.is_external);
  const externalDonorName = c.externalDonorName || c.external_donor_name || null;
  const amount = Number(c.amount ?? 0);
  const suggestedAmount = Number(c.suggestedAmount ?? c.suggested_amount ?? amount);
  const contributionStatus = c.contributionStatus || c.contribution_status || c.status || 'PENDING';
  const discountType = c.discountType || c.discount_type || 'NONE';
  const discountPercentage = Number(c.discountPercentage ?? c.discount_percentage ?? 0);
  const notes = c.notes || '';
  const paidAt = c.paidAt || c.paid_at;
  const announcedAt = c.announcedAt || c.announced_at;

  const rawMember = c.member;
  const rawPerson = rawMember?.person || c.person;

  return {
    contributionId: String(contributionId),
    collectionId: String(collectionId),
    memberId: memberId != null ? String(memberId) : null,
    isExternal,
    externalDonorName,
    amount,
    suggestedAmount,
    contributionStatus,
    discountType,
    discountPercentage,
    notes,
    paidAt,
    announcedAt,
    member: rawMember || rawPerson ? {
      memberId: String(memberId || rawMember?.memberId || rawMember?.id || ''),
      houseNumber: rawMember?.houseNumber || rawMember?.house_number || '',
      person: {
        personId: rawPerson?.personId || rawPerson?.person_id || rawPerson?.id,
        identification: String(rawPerson?.identification || rawPerson?.id_card || rawPerson?.dni || '').trim(),
        firstName: rawPerson?.firstName || rawPerson?.first_name || '',
        lastName: rawPerson?.lastName || rawPerson?.last_name || '',
        birthDate: rawPerson?.birthDate || rawPerson?.birth_date,
        hasDisability: Boolean(rawPerson?.hasDisability ?? rawPerson?.has_disability),
        disabilityPercentage: Number(rawPerson?.disabilityPercentage ?? rawPerson?.disability_percentage ?? 0),
        neighborhoodId: rawPerson?.neighborhoodId || rawPerson?.neighborhood_id || null,
        neighborhood: rawPerson?.neighborhood || undefined
      }
    } : undefined
  };
}

export function LiveCollectionPanel({ collectionId: propCollectionId }: { collectionId?: string }) {
  const params = useParams<{ id: string }>();
  const collectionId = (params?.id as string) || propCollectionId || '';

  const queryClient = useQueryClient();
  const { permissions } = usePermissionsStore();

  // Permissions
  const canPay = permissions?.[ValidModules.COLLECTIONS]?.includes(
    ValidActions.PAY_CONTRIBUTION
  ) ?? true;
  const canAnnounce = permissions?.[ValidModules.COLLECTIONS]?.includes(
    ValidActions.ANNOUNCE_CONTRIBUTION
  ) ?? true;
  const canClose = permissions?.[ValidModules.COLLECTIONS]?.includes(
    ValidActions.CLOSE_COLLECTION
  ) ?? true;

  // Local UI filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Dialogs
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [externalDialogOpen, setExternalDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [announcingId, setAnnouncingId] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (!collectionId) return;
    setIsExportingPdf(true);
    try {
      await collectionsService.downloadCollectionReportPdf(
        collectionId,
        collection?.title || 'Colecta'
      );
      toast.success('¡Informe PDF descargado correctamente! 📄');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Error al descargar el informe PDF de la colecta'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch collection details & summary
  const {
    data: collection,
    isLoading: loadingCollection,
    refetch: refetchCollection
  } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => collectionsService.getCollectionById(collectionId),
    enabled: Boolean(collectionId)
  });

  // Fetch neighborhoods list
  const { data: neighborhoodsData, isLoading: loadingNeighborhoods } = useQuery({
    queryKey: ['neighborhoods-list'],
    queryFn: () => neighborhoodsService.getNeighborhoods({ limit: 100 })
  });

  const neighborhoodsList: Neighborhood[] = neighborhoodsData?.neighborhoods || [];

  // Auto-select first neighborhood by default
  useEffect(() => {
    if (!selectedNeighborhoodId && neighborhoodsList.length > 0) {
      setSelectedNeighborhoodId(neighborhoodsList[0].neighborhoodId);
    }
  }, [neighborhoodsList, selectedNeighborhoodId]);

  const activeNeighborhoodObj = useMemo(() => {
    return (
      neighborhoodsList.find((n) => n.neighborhoodId === selectedNeighborhoodId) ||
      neighborhoodsList[0] ||
      null
    );
  }, [neighborhoodsList, selectedNeighborhoodId]);

  const activeNeighborhoodId = activeNeighborhoodObj?.neighborhoodId || selectedNeighborhoodId;
  const activeNeighborhoodName = activeNeighborhoodObj?.neighborhoodName || 'Barrio Seleccionado';

  // 1. Fetch community members for the active neighborhood
  const {
    data: membersData,
    isLoading: loadingMembers,
    refetch: refetchMembers,
    isFetching: isFetchingMembers
  } = useQuery({
    queryKey: ['community-members', activeNeighborhoodId, debouncedSearch],
    queryFn: () =>
      getMembers(100, 0, debouncedSearch, [], activeNeighborhoodId || undefined),
    enabled: Boolean(activeNeighborhoodId)
  });

  // 2. Fetch contributions for the active neighborhood
  const {
    data: neighborhoodContributionsData,
    isLoading: loadingNeighborhoodContribs,
    refetch: refetchNeighborhoodContribs,
    isFetching: isFetchingNeighborhoodContribs
  } = useQuery({
    queryKey: ['neighborhood-contributions', collectionId, activeNeighborhoodId, debouncedSearch, statusFilter],
    queryFn: () =>
      collectionsService.getContributions(collectionId, {
        limit: 200,
        offset: 0,
        search: debouncedSearch || undefined,
        neighborhoodId: statusFilter === 'EXTERNAL' ? undefined : activeNeighborhoodId || undefined,
        contributionStatus:
          statusFilter !== 'ALL' && statusFilter !== 'EXTERNAL' ? (statusFilter as any) : undefined,
        isExternal: statusFilter === 'EXTERNAL' ? true : undefined
      }),
    enabled: Boolean(collectionId)
  });

  // 3. Fetch all contributions of this collection (for global lookup)
  const {
    data: allContributionsData,
    isLoading: loadingAllContributions,
    refetch: refetchAllContributions
  } = useQuery({
    queryKey: ['all-collection-contributions', collectionId],
    queryFn: () =>
      collectionsService.getContributions(collectionId, {
        limit: 500,
        offset: 0
      }),
    enabled: Boolean(collectionId)
  });

  // Strict closed check supporting all backend properties
  const isClosed =
    collection?.collectionStatus === 'CLOSED' ||
    (collection as any)?.status === 'CLOSED' ||
    (collection as any)?.collection_status === 'CLOSED';

  // Announce mutation
  const announceMutation = useMutation({
    mutationFn: (contributionId: string) =>
      collectionsService.announceContribution(contributionId),
    onMutate: (id) => setAnnouncingId(id),
    onSuccess: () => {
      toast.success('¡Aporte anunciado públicamente por altavoz! 📢');
      queryClient.invalidateQueries({ queryKey: ['neighborhood-contributions', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['all-collection-contributions', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Error al marcar como anunciado'
      );
    },
    onSettled: () => setAnnouncingId(null)
  });

  const handleRefreshAll = () => {
    refetchCollection();
    refetchNeighborhoodContribs();
    refetchAllContributions();
    refetchMembers();
  };

  // Combine and normalize all known contributions
  const allKnownContributions = useMemo<Contribution[]>(() => {
    const listA = allContributionsData?.data || [];
    const listB = neighborhoodContributionsData?.data || [];
    const map = new Map<string, Contribution>();

    [...listA, ...listB].forEach((raw) => {
      if (!raw) return;
      const c = normalizeContribution(raw, collectionId);
      if (c.contributionId) {
        map.set(c.contributionId, c);
      }
    });

    return Array.from(map.values());
  }, [allContributionsData, neighborhoodContributionsData, collectionId]);

  // Fast contribution lookup index by multiple identifiers
  const contribsMap = useMemo(() => {
    const map = new Map<string, Contribution>();

    allKnownContributions.forEach((c) => {
      if (!c || !c.contributionId) return;

      // Contribution UUID
      map.set(c.contributionId, c);
      map.set(c.contributionId.toLowerCase(), c);

      // Member ID
      if (c.memberId != null) {
        map.set(`m_${c.memberId}`, c);
        map.set(String(c.memberId), c);
      }

      // Identification (Cédula)
      const idClean = c.member?.person?.identification?.trim();
      if (idClean) {
        map.set(`id_${idClean}`, c);
        map.set(idClean, c);
        const digitsOnly = idClean.replace(/\D/g, '');
        if (digitsOnly) map.set(digitsOnly, c);
      }

      // Person ID
      const pId = c.member?.person?.personId;
      if (pId) {
        map.set(`p_${pId}`, c);
        map.set(String(pId), c);
      }

      // Names
      const p = c.member?.person;
      if (p?.firstName && p?.lastName) {
        const nameA = `${p.firstName} ${p.lastName}`.toLowerCase().trim();
        const nameB = `${p.lastName} ${p.firstName}`.toLowerCase().trim();
        map.set(`name_${nameA}`, c);
        map.set(`name_${nameB}`, c);
      }
    });

    return map;
  }, [allKnownContributions]);

  const handlePayClick = (item: UnifiedComuneroItem) => {
    if (isClosed) {
      toast.error('Esta colecta ya se encuentra cerrada y liquidada. No se admiten nuevos pagos.');
      return;
    }

    // 1. Direct rawContribution
    if (item.rawContribution?.contributionId) {
      setSelectedContribution(item.rawContribution);
      setPayDialogOpen(true);
      return;
    }

    // 2. Direct contributionId in index
    if (item.contributionId && contribsMap.has(item.contributionId)) {
      setSelectedContribution(contribsMap.get(item.contributionId)!);
      setPayDialogOpen(true);
      return;
    }

    // 3. Lookup by memberId
    if (item.memberId) {
      const byMember = contribsMap.get(`m_${item.memberId}`) || contribsMap.get(String(item.memberId));
      if (byMember?.contributionId) {
        setSelectedContribution(byMember);
        setPayDialogOpen(true);
        return;
      }
    }

    // 4. Lookup by identification
    if (item.identification && item.identification !== 'S/N') {
      const idClean = item.identification.trim();
      const byId = contribsMap.get(`id_${idClean}`) || contribsMap.get(idClean);
      if (byId?.contributionId) {
        setSelectedContribution(byId);
        setPayDialogOpen(true);
        return;
      }
    }

    // 5. Lookup by full name in allKnownContributions
    if (item.fullName) {
      const targetName = item.fullName.toLowerCase().trim();
      const byName = allKnownContributions.find((c) => {
        const p = c.member?.person;
        if (!p) return false;
        const n1 = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase().trim();
        const n2 = `${p.lastName || ''} ${p.firstName || ''}`.toLowerCase().trim();
        return n1 === targetName || n2 === targetName;
      });
      if (byName?.contributionId) {
        setSelectedContribution(byName);
        setPayDialogOpen(true);
        return;
      }
    }

    // 6. Guaranteed Fallback
    const synth: Contribution = {
      contributionId: item.contributionId || `temp-${item.memberId || Date.now()}`,
      collectionId: collectionId,
      memberId: item.memberId,
      isExternal: false,
      amount: item.suggestedAmount,
      suggestedAmount: item.suggestedAmount,
      contributionStatus: 'PENDING',
      discountType: item.isSenior ? 'SENIOR' : item.isDisability ? 'DISABILITY' : 'NONE',
      discountPercentage: item.isSenior || item.isDisability ? 50 : 0,
      member: item.member || (item.person ? {
        memberId: String(item.memberId || ''),
        houseNumber: item.houseNumber,
        person: item.person
      } : undefined)
    };
    setSelectedContribution(synth);
    setPayDialogOpen(true);
  };

  const handleAnnounceClick = (contributionId: string) => {
    if (!contributionId) {
      toast.error('No se encontró el UUID del aporte para anunciar');
      return;
    }
    announceMutation.mutate(contributionId);
  };

  // Build unified items from members
  const unifiedComuneros = useMemo<UnifiedComuneroItem[]>(() => {
    const rawMembers = membersData?.data || [];
    const baseAmount = Number(collection?.baseAmount || 5.0);

    const isBeneficiaryMember = (m: Member) => {
      if (!collection) return false;
      if (collection.beneficiaryMemberId && String(collection.beneficiaryMemberId) === String(m.memberId)) {
        return true;
      }
      if (collection.beneficiaryName && m.person) {
        const fullName = `${m.person.firstName || ''} ${m.person.lastName || ''}`.toLowerCase().trim();
        if (fullName === collection.beneficiaryName.toLowerCase().trim()) return true;
      }
      return false;
    };

    // If on EXTERNAL tab, show external voluntary donors
    if (statusFilter === 'EXTERNAL') {
      return allKnownContributions
        .filter((c) => c.isExternal)
        .map((c) => ({
          key: `ext-${c.contributionId}`,
          isExternal: true,
          memberId: null,
          contributionId: c.contributionId,
          hasExistingContribution: true,
          member: null,
          person: null,
          fullName: c.externalDonorName || 'Donante Externo',
          identification: 'Externo',
          houseNumber: '-',
          neighborhoodName: 'Donantes Externos',
          neighborhoodId: 'external',
          isSenior: false,
          isDisability: false,
          isBeneficiary: false,
          suggestedAmount: Number(c.amount || 0),
          paidAmount: Number(c.amount || 0),
          contributionStatus: (c.contributionStatus as any) || 'PAID',
          notes: c.notes || '',
          paidAt: c.paidAt,
          announcedAt: c.announcedAt,
          rawContribution: c
        }));
    }

    // Process members of active neighborhood
    return rawMembers.map((m) => {
      const personId = (m.person as any)?.personId || (m.person as any)?.id;
      const idClean = m.person?.identification ? String(m.person.identification).trim() : '';
      const nameKey = m.person ? `${m.person.firstName || ''} ${m.person.lastName || ''}`.toLowerCase().trim() : '';
      const revNameKey = m.person ? `${m.person.lastName || ''} ${m.person.firstName || ''}`.toLowerCase().trim() : '';

      const existing =
        (m.memberId != null ? contribsMap.get(`m_${m.memberId}`) || contribsMap.get(String(m.memberId)) : undefined) ||
        (personId ? contribsMap.get(`p_${personId}`) || contribsMap.get(String(personId)) : undefined) ||
        (idClean ? contribsMap.get(`id_${idClean}`) || contribsMap.get(idClean) || contribsMap.get(idClean.replace(/\D/g, '')) : undefined) ||
        (nameKey ? contribsMap.get(`name_${nameKey}`) : undefined) ||
        (revNameKey ? contribsMap.get(`name_${revNameKey}`) : undefined);

      const beneficiary = isBeneficiaryMember(m);
      const isSenior = isSeniorCitizen(m.person?.birthDate) || existing?.discountType === 'SENIOR';
      const isDisability = Boolean(m.person?.hasDisability) || existing?.discountType === 'DISABILITY';
      const hasDiscount = isSenior || isDisability || (existing?.discountPercentage || 0) > 0;
      const suggestedAmount = hasDiscount ? baseAmount * 0.5 : baseAmount;

      const status: 'PENDING' | 'PAID' | 'ANNOUNCED' | 'EXONERATED' = beneficiary
        ? 'EXONERATED'
        : existing?.contributionStatus || 'PENDING';

      const realContributionId = existing?.contributionId || '';

      return {
        key: `member-${m.memberId}`,
        isExternal: false,
        memberId: String(m.memberId),
        contributionId: realContributionId,
        hasExistingContribution: Boolean(existing && realContributionId),
        member: m,
        person: m.person,
        fullName: `${m.person?.lastName || ''} ${m.person?.firstName || ''}`.trim() || 'Comunero Registrado',
        identification: m.person?.identification || 'S/N',
        houseNumber: m.houseNumber || 'S/N',
        neighborhoodName: activeNeighborhoodName,
        neighborhoodId: activeNeighborhoodId,
        isSenior,
        isDisability,
        isBeneficiary: beneficiary,
        suggestedAmount,
        paidAmount: existing ? Number(existing.amount) : suggestedAmount,
        contributionStatus: status,
        notes: existing?.notes || '',
        paidAt: existing?.paidAt,
        announcedAt: existing?.announcedAt,
        rawContribution: existing || null
      };
    });
  }, [membersData, allKnownContributions, contribsMap, collection, activeNeighborhoodName, activeNeighborhoodId, statusFilter]);

  // Filtered by status
  const filteredComuneros = useMemo(() => {
    return unifiedComuneros.filter((item) => {
      if (statusFilter === 'PENDING' && item.contributionStatus !== 'PENDING') return false;
      if (statusFilter === 'PAID' && item.contributionStatus !== 'PAID') return false;
      if (statusFilter === 'ANNOUNCED' && item.contributionStatus !== 'ANNOUNCED') return false;
      return true;
    });
  }, [unifiedComuneros, statusFilter]);

  // Counts for the active neighborhood
  const counts = useMemo(() => {
    const total = unifiedComuneros.length;
    const pending = unifiedComuneros.filter((i) => i.contributionStatus === 'PENDING').length;
    const paid = unifiedComuneros.filter((i) => i.contributionStatus === 'PAID').length;
    const announced = unifiedComuneros.filter((i) => i.contributionStatus === 'ANNOUNCED').length;
    const externalCount = allKnownContributions.filter((c) => c.isExternal).length;

    return { total, pending, paid, announced, external: externalCount };
  }, [unifiedComuneros, allKnownContributions]);

  // Summary figures from the collection summary endpoint
  const summary = collection?.summary || {
    totalExpected: 0,
    totalCollected: 0,
    retainedForFund: 0,
    netForBeneficiary: 0,
    countTotal: 0,
    countPending: 0,
    countPaid: 0,
    countAnnounced: 0
  };

  const getReasonBadge = (reason: string = '') => {
    switch (reason) {
      case 'HEALTH':
        return (
          <Badge className='bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] sm:text-xs shrink-0'>
            Salud / Enfermedad
          </Badge>
        );
      case 'DEATH':
        return (
          <Badge className='bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] sm:text-xs shrink-0'>
            Fallecimiento
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='text-[10px] sm:text-xs shrink-0'>
            Solidario
          </Badge>
        );
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const isLoading =
    loadingCollection ||
    loadingNeighborhoods ||
    loadingMembers ||
    loadingNeighborhoodContribs ||
    loadingAllContributions;

  return (
    <PageContainer scrollable>
      <div className='space-y-4 sm:space-y-6 pb-12 w-full max-w-full min-w-0'>
        {/* Top Header Card */}
        <div className='rounded-2xl border bg-card p-3.5 sm:p-5 shadow-xs space-y-3.5 w-full min-w-0'>
          <div className='flex items-start sm:items-center gap-3 min-w-0'>
            <Button variant='outline' size='icon' asChild className='h-9 w-9 shrink-0 mt-0.5 sm:mt-0'>
              <Link href='/dashboard/collections'>
                <ArrowLeft className='h-4 w-4' />
              </Link>
            </Button>
            <div className='min-w-0 flex-1 space-y-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h1 className='text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words'>
                  {collection?.title || 'Panel de Recaudación'}
                </h1>
                {getReasonBadge(collection?.reasonType)}
                {isClosed ? (
                  <Badge variant='secondary' className='bg-slate-500/15 text-slate-700 dark:text-slate-300 text-xs shrink-0 font-bold border border-slate-500/30 gap-1'>
                    <Lock className='h-3 w-3' /> Cerrada & Liquidada
                  </Badge>
                ) : (
                  <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 animate-pulse text-xs shrink-0'>
                    En Vivo 📢
                  </Badge>
                )}
              </div>
              <p className='text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1'>
                <span>
                  Beneficiario:{' '}
                  <span className='font-semibold text-foreground'>
                    {collection?.beneficiaryName}
                  </span>{' '}
                  {collection?.beneficiaryRelation && `(${collection.beneficiaryRelation})`}
                </span>
                <span>•</span>
                <span>Cuota: <strong>${Number(collection?.baseAmount || 5).toFixed(2)}</strong></span>
                <span>•</span>
                <span>Retención: <strong>{collection?.fundRetentionPercentage || 10}%</strong></span>
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className='flex items-center justify-between gap-2 pt-2 border-t w-full flex-wrap sm:flex-nowrap'>
            <div className='flex items-center gap-2 flex-wrap w-full sm:w-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefreshAll}
                disabled={isFetchingNeighborhoodContribs || isFetchingMembers}
                className='h-9 text-xs flex-1 sm:flex-none'
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetchingNeighborhoodContribs || isFetchingMembers ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>

              <Button
                variant='outline'
                size='sm'
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className='h-9 text-xs flex-1 sm:flex-none border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-semibold'
              >
                {isExportingPdf ? (
                  <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
                ) : (
                  <FileText className='mr-1.5 h-3.5 w-3.5' />
                )}
                Descargar Acta PDF
              </Button>

              {!isClosed && canPay && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setExternalDialogOpen(true)}
                  className='h-9 text-xs flex-1 sm:flex-none border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 font-semibold'
                >
                  <UserPlus className='mr-1.5 h-3.5 w-3.5' />
                  + Aporte Ext.
                </Button>
              )}

              {!isClosed && canClose && (
                <Button
                  size='sm'
                  onClick={() => setCloseDialogOpen(true)}
                  className='h-9 text-xs w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium'
                >
                  <Lock className='mr-1.5 h-3.5 w-3.5' />
                  Cerrar y Liquidar
                </Button>
              )}
            </div>

            {isClosed && (
              <div className='flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl font-medium'>
                <Lock className='h-3.5 w-3.5 text-amber-600 shrink-0' />
                <span>Colecta cerrada • No se aceptan nuevos cobros</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Financial KPI Summary Cards (2x2 on mobile, 4 in a row on desktop) */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full min-w-0'>
          {/* Card 1: Total Recaudado */}
          <Card className='border-emerald-500/30 bg-emerald-500/5 shadow-xs p-3 sm:p-4 min-w-0 overflow-hidden'>
            <div className='flex items-center justify-between gap-1'>
              <span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate'>
                Recaudado
              </span>
              <div className='flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0'>
                <DollarSign className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </div>
            </div>
            <div className='mt-1.5 text-base sm:text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 truncate'>
              ${Number(summary.totalCollected || 0).toFixed(2)}
            </div>
            <p className='text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 truncate'>
              Meta: ${Number(summary.totalExpected || 0).toFixed(2)}
            </p>
          </Card>

          {/* Card 2: Para la Familia */}
          <Card className='border-rose-500/30 bg-rose-500/5 shadow-xs p-3 sm:p-4 min-w-0 overflow-hidden'>
            <div className='flex items-center justify-between gap-1'>
              <span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate'>
                Para Familia
              </span>
              <div className='flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0'>
                <Heart className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </div>
            </div>
            <div className='mt-1.5 text-base sm:text-2xl lg:text-3xl font-black text-rose-600 dark:text-rose-400 truncate'>
              ${Number(summary.netForBeneficiary || 0).toFixed(2)}
            </div>
            <p className='text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 truncate'>
              {100 - (collection?.fundRetentionPercentage || 10)}% neto directo
            </p>
          </Card>

          {/* Card 3: Para Fondo Común */}
          <Card className='border-blue-500/30 bg-blue-500/5 shadow-xs p-3 sm:p-4 min-w-0 overflow-hidden'>
            <div className='flex items-center justify-between gap-1'>
              <span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate'>
                Fondo Comunal
              </span>
              <div className='flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0'>
                <PiggyBank className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </div>
            </div>
            <div className='mt-1.5 text-base sm:text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-400 truncate'>
              ${Number(summary.retainedForFund || 0).toFixed(2)}
            </div>
            <p className='text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 truncate'>
              {collection?.fundRetentionPercentage || 10}% retención
            </p>
          </Card>

          {/* Card 4: Avance General */}
          <Card className='shadow-xs p-3 sm:p-4 min-w-0 overflow-hidden'>
            <div className='flex items-center justify-between gap-1'>
              <span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate'>
                Avance General
              </span>
              <div className='flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0'>
                <Users className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </div>
            </div>
            <div className='mt-1.5 flex items-center gap-1 text-xs sm:text-sm font-bold truncate'>
              <span className='text-emerald-600'>{Number(summary.countPaid || 0) + Number(summary.countAnnounced || 0)} Pag.</span>
              <span>•</span>
              <span className='text-amber-600'>{Number(summary.countPending || 0)} Pend.</span>
            </div>
            <p className='text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 truncate'>
              Total: {summary.countTotal || 0} socios
            </p>
          </Card>
        </div>

        {/* Search & Barrio Selector Bar */}
        <div className='rounded-2xl border bg-card p-3.5 sm:p-4 space-y-3 shadow-xs w-full min-w-0 overflow-hidden'>
          {/* Main search and dropdown row */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full min-w-0'>
            {/* Live Search Input */}
            <div className='relative flex-1 min-w-0'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={`Buscar en ${activeNeighborhoodName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-9 h-10 text-xs sm:text-sm font-medium rounded-xl w-full'
              />
            </div>

            {/* Neighborhood Filter Dropdown */}
            <div className='w-full sm:w-60 shrink-0'>
              <Select
                value={activeNeighborhoodId}
                onValueChange={setSelectedNeighborhoodId}
              >
                <SelectTrigger className='h-10 text-xs font-semibold rounded-xl w-full'>
                  <Building2 className='h-3.5 w-3.5 mr-2 text-primary shrink-0' />
                  <SelectValue placeholder='Seleccionar Barrio' />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  {neighborhoodsList.map((n) => (
                    <SelectItem key={n.neighborhoodId} value={n.neighborhoodId}>
                      {n.neighborhoodName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className='flex flex-wrap items-center gap-1.5 pt-1 border-t w-full min-w-0'>
            {[
              { id: 'ALL', label: `Todos (${counts.total})` },
              { id: 'PENDING', label: `Pendientes (${counts.pending})`, color: 'text-amber-700 dark:text-amber-300' },
              { id: 'PAID', label: `Por Anunciar (${counts.paid})`, color: 'text-emerald-700 dark:text-emerald-300' },
              { id: 'ANNOUNCED', label: `Anunciados (${counts.announced})`, color: 'text-blue-700 dark:text-blue-300' },
              { id: 'EXTERNAL', label: `Donantes Ext. (${counts.external})`, color: 'text-purple-700 dark:text-purple-300' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setStatusFilter(tab.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Members List */}
        {isLoading ? (
          <div className='space-y-3 w-full min-w-0'>
            <div className='rounded-2xl border bg-card p-5 space-y-3'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-16 w-full rounded-xl' />
              <Skeleton className='h-16 w-full rounded-xl' />
            </div>
          </div>
        ) : filteredComuneros.length === 0 ? (
          <div className='rounded-2xl border bg-card p-8 sm:p-12 text-center text-muted-foreground space-y-2 shadow-xs w-full min-w-0'>
            <Users className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/40' />
            <h3 className='font-semibold text-foreground text-sm sm:text-base'>
              No se encontraron comuneros en {activeNeighborhoodName}
            </h3>
            <p className='text-xs max-w-sm mx-auto'>
              No hay comuneros que coincidan con la búsqueda o el estado seleccionado.
            </p>
          </div>
        ) : (
          <div className='rounded-2xl border bg-card overflow-hidden shadow-xs w-full min-w-0'>
            {/* Barrio Header Bar */}
            <div className='p-3.5 sm:p-4 bg-muted/20 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full'>
              <div className='flex items-center gap-2.5 min-w-0'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0'>
                  <Building2 className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-bold text-xs sm:text-sm text-foreground flex items-center gap-2 truncate'>
                    <span>{statusFilter === 'EXTERNAL' ? 'Donantes Externos Voluntarios' : activeNeighborhoodName}</span>
                    <Badge variant='outline' className='text-[11px] font-semibold shrink-0'>
                      {filteredComuneros.length} socio{filteredComuneros.length !== 1 ? 's' : ''}
                    </Badge>
                  </h3>
                </div>
              </div>

              <div className='flex items-center gap-2 text-xs font-medium shrink-0'>
                <Badge className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px] sm:text-[11px]'>
                  {filteredComuneros.filter((i) => i.contributionStatus === 'PAID' || i.contributionStatus === 'ANNOUNCED').length} Pagados
                </Badge>
                <Badge variant='secondary' className='bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px] sm:text-[11px]'>
                  {filteredComuneros.filter((i) => i.contributionStatus === 'PENDING').length} Pendientes
                </Badge>
              </div>
            </div>

            {/* List of Comuneros with Mobile Card and Desktop Row Layout */}
            <div className='divide-y w-full min-w-0'>
              {filteredComuneros.map((item) => {
                const isPending = item.contributionStatus === 'PENDING';
                const isPaid = item.contributionStatus === 'PAID';
                const isAnnounced = item.contributionStatus === 'ANNOUNCED';
                const isExonerated = item.contributionStatus === 'EXONERATED';
                const isAnnouncingThis = announcingId === item.contributionId;

                return (
                  <div
                    key={item.key}
                    className={`p-3.5 sm:p-4 transition-colors w-full min-w-0 space-y-2.5 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 ${
                      isPending
                        ? 'hover:bg-amber-500/5 bg-background'
                        : isPaid
                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                        : isExonerated
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : 'hover:bg-muted/40 bg-background'
                    }`}
                  >
                    {/* Comunero Identity & Details */}
                    <div className='flex items-start gap-3 min-w-0 flex-1'>
                      <div
                        className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl font-bold text-xs sm:text-sm shadow-xs ${
                          item.isExternal
                            ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                            : isExonerated
                            ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                            : isPaid
                            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        {item.isExternal ? (
                          <User className='h-4 w-4 sm:h-5 sm:w-5' />
                        ) : isExonerated ? (
                          <Star className='h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-amber-500' />
                        ) : (
                          `${item.person?.firstName?.[0] || ''}${item.person?.lastName?.[0] || ''}`.toUpperCase() || 'C'
                        )}
                      </div>

                      <div className='space-y-1 min-w-0 flex-1'>
                        <div className='flex items-center gap-1.5 flex-wrap'>
                          <span className='font-bold text-xs sm:text-sm text-foreground break-words'>
                            {item.fullName}
                          </span>

                          {item.isBeneficiary && (
                            <Badge className='bg-amber-500 text-white font-bold text-[10px] gap-1 px-1.5 py-0'>
                              <Star className='h-2.5 w-2.5 fill-white' />
                              Beneficiario
                            </Badge>
                          )}

                          {item.isSenior && (
                            <Badge
                              variant='secondary'
                              className='bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold px-1.5 py-0'
                            >
                              3ra Edad - 50%
                            </Badge>
                          )}

                          {item.isDisability && (
                            <Badge
                              variant='secondary'
                              className='bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] font-semibold px-1.5 py-0'
                            >
                              Discapacidad - 50%
                            </Badge>
                          )}

                          {item.isExternal && (
                            <Badge
                              variant='outline'
                              className='bg-purple-500/10 text-purple-700 border-purple-500/30 text-[10px]'
                            >
                              Donante Ext.
                            </Badge>
                          )}
                        </div>

                        <div className='flex items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-muted-foreground flex-wrap'>
                          {!item.isExternal && (
                            <>
                              <span className='font-mono'>CI: {item.identification}</span>
                              <span>•</span>
                              <span>Casa #{item.houseNumber}</span>
                              <span>•</span>
                            </>
                          )}
                          <span className='flex items-center gap-1'>
                            <MapPin className='h-3 w-3 text-primary shrink-0' /> {item.neighborhoodName}
                          </span>
                        </div>

                        {item.notes && (
                          <p className='text-[10px] sm:text-[11px] text-muted-foreground italic truncate'>
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom row on mobile / Right column on desktop */}
                    <div className='flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/50 w-full md:w-auto'>
                      {/* Financial Amount */}
                      <div className='flex items-baseline md:flex-col md:items-end gap-1 min-w-[70px] md:min-w-[110px]'>
                        <span className='text-[10px] text-muted-foreground font-medium'>
                          {isPending ? 'Cuota:' : 'Monto:'}
                        </span>
                        <span className='text-sm sm:text-base font-black'>
                          {isExonerated ? (
                            <span className='text-amber-600 font-bold text-xs'>$0.00 (Exon.)</span>
                          ) : isPending ? (
                            <span className='text-foreground'>
                              ${item.suggestedAmount.toFixed(2)}
                            </span>
                          ) : (
                            <span className='text-emerald-600 dark:text-emerald-400'>
                              ${Number(item.paidAmount).toFixed(2)}
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Status & Immediate Action Button */}
                      <div className='flex items-center gap-1.5 shrink-0'>
                        {/* Status Badge */}
                        <div className='shrink-0'>
                          {isPending && (
                            <Badge
                              variant='secondary'
                              className='bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] sm:text-[11px] py-0.5 px-2 font-semibold'
                            >
                              <Clock className='h-3 w-3 mr-1 text-amber-600' />
                              Pendiente
                            </Badge>
                          )}
                          {isPaid && (
                            <Badge
                              className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] sm:text-[11px] py-0.5 px-2 font-semibold'
                            >
                              <CheckCircle2 className='h-3 w-3 mr-1 text-emerald-600' />
                              Pagado
                            </Badge>
                          )}
                          {isAnnounced && (
                            <Badge
                              className='bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[10px] sm:text-[11px] py-0.5 px-2 font-semibold'
                            >
                              <Volume2 className='h-3 w-3 mr-1 text-blue-600' />
                              Anunciado ✓
                            </Badge>
                          )}
                          {isExonerated && (
                            <Badge
                              className='bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30 text-[10px] sm:text-[11px] py-0.5 px-2'
                            >
                              Exonerado
                            </Badge>
                          )}
                        </div>

                        {/* Action Button (Hidden or Replaced when Closed) */}
                        <div className='shrink-0'>
                          {isPending && !isExonerated && (
                            isClosed ? (
                              <Badge
                                variant='outline'
                                className='text-[10px] sm:text-[11px] text-muted-foreground bg-muted/40 font-medium py-1 px-2.5 gap-1 border-dashed'
                              >
                                <Lock className='h-3 w-3 text-muted-foreground' /> Cerrada
                              </Badge>
                            ) : (
                              <Button
                                size='sm'
                                onClick={() => handlePayClick(item)}
                                disabled={!canPay}
                                className='bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 font-bold shadow-xs'
                              >
                                <DollarSign className='mr-0.5 h-3.5 w-3.5' />
                                Cobrar $
                              </Button>
                            )
                          )}

                          {isPaid && (
                            <Button
                              size='sm'
                              onClick={() => handleAnnounceClick(item.contributionId)}
                              disabled={!canAnnounce || isAnnouncingThis}
                              className='bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 font-bold shadow-xs'
                            >
                              <Megaphone
                                className={`mr-1 h-3.5 w-3.5 ${isAnnouncingThis ? 'animate-bounce' : ''}`}
                              />
                              {isAnnouncingThis ? '...' : 'Anunciar 📢'}
                            </Button>
                          )}

                          {isAnnounced && (
                            <div className='text-right'>
                              <span className='text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 justify-end'>
                                <Check className='h-3 w-3' /> Listo
                              </span>
                              {item.announcedAt && (
                                <span className='text-[10px] text-muted-foreground'>
                                  {formatTime(item.announcedAt)}
                                </span>
                              )}
                            </div>
                          )}

                          {isExonerated && (
                            <span className='text-[11px] text-muted-foreground italic'>
                              Exento
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modals */}
        <PayContributionDialog
          open={payDialogOpen}
          onOpenChange={setPayDialogOpen}
          contribution={selectedContribution}
          allContributions={allKnownContributions}
          baseAmount={Number(collection?.baseAmount || 5)}
          collectionId={collectionId}
          isClosed={isClosed}
          onSuccess={handleRefreshAll}
        />

        <ExternalContributionDialog
          open={externalDialogOpen}
          onOpenChange={setExternalDialogOpen}
          collectionId={collectionId}
          isClosed={isClosed}
          onSuccess={handleRefreshAll}
        />

        <CloseCollectionDialog
          open={closeDialogOpen}
          onOpenChange={setCloseDialogOpen}
          collection={collection || null}
          onSuccess={handleRefreshAll}
        />
      </div>
    </PageContainer>
  );
}
