-- Adiciona DEFAULT gen_random_uuid() nas colunas id que não têm
DO $$ 
BEGIN
  -- Habilita a extensão se não existir
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  
  -- Altera a coluna id da tabela users se não tiver DEFAULT
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'id' 
    AND column_default IS NULL
  ) THEN
    ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- Altera a coluna id da tabela transactions se não tiver DEFAULT
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name = 'id' 
    AND column_default IS NULL
  ) THEN
    ALTER TABLE transactions ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

