-- Insert data into roles
INSERT INTO roles (role_id, role_name, description) VALUES
                                                        (1, 'USER', 'Regular student role'),
                                                        (2, 'SUPERVISORY', 'Administrator role'),
                                                        (3, 'EXAM_COMMITTEE', 'Exam committee member role'),
                                                        (4, 'ADMIN', 'Exam supervisor role');

INSERT INTO permissions (permission_name, description) VALUES
                                                           ('VIEW_DASHBOARD', 'Permission to delete answers for questions'),
                                                           ('TAKE_EXAM', 'Permission to delete answers for questions'),
                                                           ('CREATE_QUESTION', 'Permission to create new questions'),
                                                           ('EDIT_QUESTION', 'Permission to edit existing questions'),
                                                           ('DELETE_QUESTION', 'Permission to delete questions'),
                                                           ('VIEW_QUESTION', 'Permission to view questions'),
                                                           ('CREATE_EXAM', 'Permission to create new exams'),
                                                           ('EDIT_EXAM', 'Permission to edit existing exams'),
                                                           ('DELETE_EXAM', 'Permission to delete exams'),
                                                           ('VIEW_EXAM', 'Permission to view exams'),
                                                           ('CREATE_ANSWER', 'Permission to create answers for questions'),
                                                           ('EDIT_ANSWER', 'Permission to edit existing answers'),
                                                           ('DELETE_ANSWER', 'Permission to delete answers for questions');
-- 1. Tạo trigger function
CREATE OR REPLACE FUNCTION assign_default_permissions()
RETURNS TRIGGER AS $$
BEGIN
    -- Gán quyền mặc định cho người dùng mới vào bảng has_role_permission
INSERT INTO has_role_permission (user_id, role_id, permission_id)
VALUES (NEW.user_id, 1, 1),    -- Ví dụ: quyền VIEW_DASHBOARD
       (NEW.user_id, 1, 2),    -- Ví dụ: quyền TAKE_QUIZ
       (NEW.user_id, 1, 10);   -- Ví dụ: quyền VIEW_PROFILE

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Tạo trigger để kích hoạt function sau khi chèn bản ghi mới vào bảng application_user
CREATE OR REPLACE TRIGGER after_user_insert
AFTER INSERT ON application_user
FOR EACH ROW
EXECUTE FUNCTION assign_default_permissions();
-------------------
CREATE OR REPLACE FUNCTION update_user_role()
RETURNS TRIGGER AS $$
BEGIN
DELETE FROM has_role_permission WHERE user_id = NEW.user_id;

IF NEW.role_id = 1 THEN  -- USER
        INSERT INTO has_role_permission (user_id, role_id, permission_id)
        VALUES
            (NEW.user_id, NEW.role_id, 1),
            (NEW.user_id, NEW.role_id, 2),
            (NEW.user_id, NEW.role_id, 10);

    ELSIF NEW.role_id = 2 THEN  -- SUPERVISORY
        INSERT INTO has_role_permission (user_id, role_id, permission_id)
        VALUES
            (NEW.user_id, NEW.role_id, 1),
            (NEW.user_id, NEW.role_id, 10);

    ELSIF NEW.role_id = 3 THEN  -- EXAM_COMMITTEE
        INSERT INTO has_role_permission (user_id, role_id, permission_id)
        VALUES
            (NEW.user_id, NEW.role_id, 1),
            (NEW.user_id, NEW.role_id, 7),
			(NEW.user_id, NEW.role_id, 8),
			(NEW.user_id, NEW.role_id, 9),
            (NEW.user_id, NEW.role_id, 10),
            (NEW.user_id, NEW.role_id, 5);

    ELSIF NEW.role_id = 4 THEN  -- ADMIN
        INSERT INTO has_role_permission (user_id, role_id, permission_id)
        VALUES
            (NEW.user_id, NEW.role_id, 1),
            (NEW.user_id, NEW.role_id, 2),
            (NEW.user_id, NEW.role_id, 3),
            (NEW.user_id, NEW.role_id, 4),
            (NEW.user_id, NEW.role_id, 5),
			(NEW.user_id, NEW.role_id, 6),
			(NEW.user_id, NEW.role_id, 7),
			(NEW.user_id, NEW.role_id, 8),
			(NEW.user_id, NEW.role_id, 9),
            (NEW.user_id, NEW.role_id, 10),
            (NEW.user_id, NEW.role_id, 11),
			 (NEW.user_id, NEW.role_id, 12),
			  (NEW.user_id, NEW.role_id, 13);

ELSE
        INSERT INTO has_role_permission (user_id, role_id, permission_id)
        VALUES
            (NEW.user_id, NEW.role_id, 5);
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger gắn với bảng
CREATE OR REPLACE TRIGGER update_user_role_trigger
AFTER UPDATE OF role_id ON has_role_permission
    FOR EACH ROW
    EXECUTE FUNCTION update_user_role();