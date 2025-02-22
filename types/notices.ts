export interface NoticeCreation {
  title:         string;
  description:   string;
  coverImageUrl: string;
  content:       string;
  type:         NoticeType;
}

export enum NoticeType {
  Noticia = 'Noticia',
  Evento = 'Evento',
  Anuncio = 'Anuncio',
  Blog = 'Blog',
  Aviso = 'Aviso'
}