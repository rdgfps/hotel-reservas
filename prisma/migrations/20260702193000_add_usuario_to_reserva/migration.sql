ALTER TABLE "reservas" ADD COLUMN "usuarioId" INTEGER;

UPDATE "reservas"
SET "usuarioId" = (SELECT "id" FROM "usuarios" ORDER BY "id" ASC LIMIT 1)
WHERE "usuarioId" IS NULL
  AND EXISTS (SELECT 1 FROM "usuarios");

CREATE INDEX "idx_reservas_usuario" ON "reservas"("usuarioId");

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
