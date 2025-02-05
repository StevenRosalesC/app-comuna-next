export const getRelativeTime = (date: string) => {
  const currentDate = new Date();
  const noticeDate = new Date(date);
  const diffTime = Math.abs(currentDate.getTime() - noticeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.ceil(diffDays / 30);

  if (diffDays < 30) {
    return `Hace ${diffDays} días`;
  } else if (diffMonths < 12) {
    return `Hace ${diffMonths} meses`;
  } else {
    return noticeDate.toLocaleDateString('es-ES', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
};
