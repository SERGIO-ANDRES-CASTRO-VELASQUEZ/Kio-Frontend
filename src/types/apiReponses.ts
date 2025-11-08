// Basado en dto/TokenResponse.java
export interface TokenResponse {
  access: string;
  refresh: string;
}

// ... puedes añadir más tipos para otras respuestas, ej. UserDetailResponse