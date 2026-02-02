-- Schema per il calendario attività

-- Tabella tipologie attività
CREATE TABLE IF NOT EXISTS activity_types (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT 'blue',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabella attività
CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES activity_types(id) ON DELETE CASCADE
);

-- Indice per ricerche per data
CREATE INDEX idx_activities_date ON activities(date);

-- Inserisci tipologie predefinite se non esistono
INSERT IGNORE INTO activity_types (id, name, color) VALUES
  ('type-1', 'Task 1', 'blue'),
  ('type-2', 'Task 2', 'yellow'),
  ('type-3', 'Task 3', 'red'),
  ('type-4', 'Task 4', 'green'),
  ('type-5', 'Task 5', 'pink');
