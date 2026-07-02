ALTER TABLE "usuarios"
ADD COLUMN "nivel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'INATIVO',
ADD COLUMN "codigoAtivacao" VARCHAR(80),
ADD COLUMN "tentativasInvalidas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "bloqueado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ultimoLogin" TIMESTAMP(6),
ADD COLUMN "codigoRecuperacao" VARCHAR(80),
ADD COLUMN "recuperacaoExpiraEm" TIMESTAMP(6);

UPDATE "usuarios"
SET "status" = 'ATIVO',
    "nivel" = 3
WHERE "email" = 'admin@hotel.com';

UPDATE "usuarios"
SET "status" = 'ATIVO'
WHERE "email" <> 'admin@hotel.com';
