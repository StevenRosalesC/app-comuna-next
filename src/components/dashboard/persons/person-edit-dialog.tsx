"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Person } from "@/interfaces/persons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect } from "react"
import { SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { useNeighborhoodsStore } from "@/hooks/store/useNeighborhoodsStore"
import { Neighborhood } from "@/store/neighborhoodsStore"
import { Switch } from "@/components/ui/switch"

const personFormSchema = z.object({
  personId: z.string().optional(),
  identification: z.string().min(1, "La cédula es requerida"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  birthDate: z.string(),
  neighborhoodId: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.number().optional(),
  status: z.boolean().optional(),
})

type PersonFormValues = z.infer<typeof personFormSchema>

interface PersonEditDialogProps {
  person: Person | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (person: Person) => void
}
export function PersonEditDialog({
  person,
  open,
  onOpenChange,
  onSave
}: PersonEditDialogProps) {
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
  })

  const { neighborhoods } = useNeighborhoodsStore((state) => ({
    neighborhoods: state.neighborhoods,
  }))


  const neighborhoodsOptions = neighborhoods.map((neighborhood: Neighborhood) => (
    <SelectItem key={neighborhood.neighborhoodId} value={neighborhood.neighborhoodId}>
      {neighborhood.neighborhoodName}
    </SelectItem>
  ))
  useEffect(() => {
    if (person) {
      form.reset({
        identification: person.identification,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email || "",
        birthDate: person.birthDate ? new Date(person.birthDate).toISOString().split('T')[0] : "",
        neighborhoodId: person.neighborhoodId || "",
        status: person.status ?? true,
      })
    }
  }, [person, form.reset, form])


  function onSubmit(data: PersonFormValues) {
    try {
      // Convert form values to a Person object
      const personToSave: Person = {
        ...person!, // Keep existing fields like id
        identification: data.identification,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || '',
        birthDate: new Date(data.birthDate), // Convert string to Date
        neighborhoodId: data.neighborhoodId || '', // Ensure neighborhoodId is not undefined
        status: data.status ?? true,
      }
      onSave?.(personToSave)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error("Error al actualizar la persona")
    }
  }

  if (!person) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
          <DialogDescription>
            Realice los cambios necesarios en el formulario. Haga clic en guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cédula</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="neighborhoodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barrio</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el barrio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {neighborhoodsOptions}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Estado</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 