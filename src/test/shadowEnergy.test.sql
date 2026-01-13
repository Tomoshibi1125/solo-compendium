-- Test file for calculate_shadow_energy_max function
-- This file contains SQL tests to verify the shadow energy calculation works correctly

-- Test setup: Create a test character
-- Note: These tests should be run in a test environment

-- Test 1: Level 1 character should have 10 max shadow energy
SELECT 'Test 1: Level 1 character should have 10 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000001') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000001' AND level = 1);

-- Test 2: Level 4 character should have 10 max shadow energy (upper bound of first tier)
SELECT 'Test 2: Level 4 character should have 10 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000002') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000002' AND level = 4);

-- Test 3: Level 5 character should have 25 max shadow energy (second tier)
SELECT 'Test 3: Level 5 character should have 25 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000003') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000003' AND level = 5);

-- Test 4: Level 8 character should have 25 max shadow energy (upper bound of second tier)
SELECT 'Test 4: Level 8 character should have 25 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000004') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000004' AND level = 8);

-- Test 5: Level 9 character should have 50 max shadow energy (third tier)
SELECT 'Test 5: Level 9 character should have 50 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000005') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000005' AND level = 9);

-- Test 6: Level 12 character should have 50 max shadow energy (upper bound of third tier)
SELECT 'Test 6: Level 12 character should have 50 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000006') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000006' AND level = 12);

-- Test 7: Level 13 character should have 100 max shadow energy (fourth tier)
SELECT 'Test 7: Level 13 character should have 100 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000007') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000007' AND level = 13);

-- Test 8: Level 16 character should have 100 max shadow energy (upper bound of fourth tier)
SELECT 'Test 8: Level 16 character should have 100 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000008') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000008' AND level = 16);

-- Test 9: Level 17 character should have 200 max shadow energy (fifth tier)
SELECT 'Test 9: Level 17 character should have 200 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000009') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000009' AND level = 17);

-- Test 10: Level 20 character should have 200 max shadow energy (max level)
SELECT 'Test 10: Level 20 character should have 200 max shadow energy' AS test_name;
SELECT calculate_shadow_energy_max('00000000-0000-0000-0000-000000000010') AS result
WHERE EXISTS (SELECT 1 FROM characters WHERE id = '00000000-0000-0000-0000-000000000010' AND level = 20);

-- Test data setup (for testing purposes)
-- These INSERT statements should be run in a test environment and cleaned up after testing

/*
-- Test data setup:
INSERT INTO characters (id, user_id, name, level) VALUES 
('00000000-0000-0000-0000-000000000001', 'test-user-1', 'Test Character Level 1', 1),
('00000000-0000-0000-0000-000000000002', 'test-user-2', 'Test Character Level 4', 4),
('00000000-0000-0000-0000-000000000003', 'test-user-3', 'Test Character Level 5', 5),
('00000000-0000-0000-0000-000000000004', 'test-user-4', 'Test Character Level 8', 8),
('00000000-0000-0000-0000-000000000005', 'test-user-5', 'Test Character Level 9', 9),
('00000000-0000-0000-0000-000000000006', 'test-user-6', 'Test Character Level 12', 12),
('00000000-0000-0000-0000-000000000007', 'test-user-7', 'Test Character Level 13', 13),
('00000000-0000-0000-0000-000000000008', 'test-user-8', 'Test Character Level 16', 16),
('00000000-0000-0000-0000-000000000009', 'test-user-9', 'Test Character Level 17', 17),
('00000000-0000-0000-0000-000000000010', 'test-user-10', 'Test Character Level 20', 20);

-- Cleanup:
DELETE FROM characters WHERE id LIKE '00000000-0000-0000-0000-000000000%';
*/
