CREATE OR REPLACE PROCEDURE populate_with_data(
  total INTEGER
) AS
$$
  DECLARE
    counter INTEGER := 1;
    user_id TEXT;
  BEGIN
    DELETE FROM users;
    DELETE FROM docs;
    DELETE FROM files;

    LOOP
      user_id := 'ID' || CAST(counter AS TEXT);

      INSERT INTO users(user_id, username) VALUES (user_id, user_id);
      INSERT INTO docs(doc_id, user_id, status) VALUES
        (counter, user_id, 'in-progress'),
        (counter + 1, user_id, 'completed');
      INSERT INTO files(file_id, doc_id, file_name, file_type) VALUES
        ('T' || CAST(counter AS TEXT), counter, 'FILE', 'template'),
        ('R' || CAST(counter AS TEXT), counter, 'FILE', 'result'),
        ('T' || CAST((counter + 1) AS TEXT), counter + 1, 'FILE', 'template'),
        ('R' || CAST((counter + 1) AS TEXT), counter + 1, 'FILE', 'result');

      counter := counter + 2;

      IF counter > (total * 2) THEN
        EXIT;
      END IF;
    END LOOP;
  END;
$$
LANGUAGE plpgsql;
