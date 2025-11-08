// Basado en ImageDTO.java
export interface Image {
  id: number;
  url: string;
}

// Basado en TagDTO.java
export interface Tag {
  id: number;
  name: string;
  imageURL?: string;
}

// Basado en admin/SizeDTO.java
export interface Size {
  id: number;
  name: string;
}

// Basado en admin/ColorDTO.java
export interface Color {
  id: number;
  name: string;
}

// Basado en admin/ProductAdminResponse.java
export interface Product {
  id: number;
  title: string;
  price: string; // El DTO de admin convierte BigDecimal a string
  description: string;
  slug: string;
  stock: number;
  status: 'draft' | 'published'; // Definimos los estados posibles
  published: string; // Es un string de fecha (LocalDateTime)
  sizes: Size[];
  colors: Color[];
  tags: Tag[];
  images: Image[];
}

// Para el payload del JWT (basado en JwtUtil.java y UserProfile.java)
export interface DecodedJwt {
  sub: string; // email
  user_id: number;
  roles: string[]; // ej. ["ROLE_ADMIN", "ROLE_USER"]
  exp: number;
  iat: number;
}

// Para el usuario en nuestro AuthContext
export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
  accountId?: number; // Lo obtendremos de /user/{pk}
}

// Para el CartContext (basado en Product)
export interface CartItem {
  id: number;
  title: string;
  price: number; // Guardamos el precio como número
  image: string;
  quantity: number;
}