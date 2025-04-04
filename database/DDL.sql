CREATE TABLE "tipos_usuarios" (
  "id_tipo_usuario" serial PRIMARY KEY,
  "nombre_tipo" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "usuarios" (
  "codigo" bigint PRIMARY KEY,
  "correo" varchar(100) UNIQUE NOT NULL,
  "contrasena" text NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "apellido" varchar(100),
  "id_tipo_usuario" int NOT NULL,
  "activo" bool DEFAULT true
);

CREATE TABLE "tipos_eventos" (
  "id_tipo_evento" serial PRIMARY KEY,
  "categoria" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "eventos" (
  "id_evento" serial PRIMARY KEY,
  "nombre_evento" varchar(200) NOT NULL,
  "lugar_evento" varchar(200) NOT NULL,
  "fecha_evento" date NOT NULL,
  "hora_evento" time NOT NULL,
  "id_tipo_evento" int NOT NULL,
  "codigo_admin" bigint
);

CREATE TABLE "likes_estudiantes" (
  "codigo_estudiante" bigint,
  "id_evento" int,
  PRIMARY KEY ("codigo_estudiante", "id_evento")
);

ALTER TABLE "usuarios" ADD FOREIGN KEY ("id_tipo_usuario") REFERENCES "tipos_usuarios" ("id_tipo_usuario");

ALTER TABLE "eventos" ADD FOREIGN KEY ("id_tipo_evento") REFERENCES "tipos_eventos" ("id_tipo_evento");

ALTER TABLE "eventos" ADD FOREIGN KEY ("codigo_admin") REFERENCES "usuarios" ("codigo");

ALTER TABLE "likes_estudiantes" ADD FOREIGN KEY ("codigo_estudiante") REFERENCES "usuarios" ("codigo");

ALTER TABLE "likes_estudiantes" ADD FOREIGN KEY ("id_evento") REFERENCES "eventos" ("id_evento");
