CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "criado_em" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quartos" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "criado_em" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quartos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "quarto_id" INTEGER NOT NULL,
    "data_entrada" DATE NOT NULL,
    "data_saida" DATE NOT NULL,
    "status" CHAR(3) NOT NULL DEFAULT 'NPG',
    "criado_em" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");
CREATE UNIQUE INDEX "quartos_numero_key" ON "quartos"("numero");
CREATE INDEX "idx_reservas_cliente" ON "reservas"("cliente_id");
CREATE INDEX "idx_reservas_quarto" ON "reservas"("quarto_id");
CREATE INDEX "idx_reservas_periodo" ON "reservas"("quarto_id", "data_entrada", "data_saida");

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_cliente_id_fkey"
FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_quarto_id_fkey"
FOREIGN KEY ("quarto_id") REFERENCES "quartos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quartos" ADD CONSTRAINT "quartos_tipo_check"
CHECK ("tipo" IN ('Simples', 'Duplo', 'Suite'));

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_status_check"
CHECK ("status" IN ('PG', 'NPG'));

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_datas_check"
CHECK ("data_saida" > "data_entrada");
