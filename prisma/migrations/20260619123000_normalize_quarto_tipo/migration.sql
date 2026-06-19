ALTER TABLE "quartos" DROP CONSTRAINT IF EXISTS "quartos_tipo_check";

UPDATE "quartos"
SET "tipo" = 'Suite'
WHERE "tipo" <> 'Simples' AND "tipo" <> 'Duplo';

ALTER TABLE "quartos" ADD CONSTRAINT "quartos_tipo_check"
CHECK ("tipo" IN ('Simples', 'Duplo', 'Suite'));
