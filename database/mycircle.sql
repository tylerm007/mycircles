-- drop database circles;
-- create database circles;

DROP TABLE IF EXISTS response;
DROP TABLE IF EXISTS daily_response_count;
DROP TABLE IF EXISTS card_selection;
-- DROP TABLE IF EXISTS card;
DROP TABLE IF EXISTS circle;

DROP TABLE IF EXISTS question_tags;
DROP TABLE IF EXISTS cardtype;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS fellowship; 


CREATE TABLE fellowship (
    name VARCHAR(5) PRIMARY KEY,
    full_name VARCHAR(100) ,
    website VARCHAR(1000)
);

INSERT INTO fellowship (name, full_name) values ('SAA', 'Sex Addicts Anonymous');


-- use tags instead of circle_type

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL,
    fellowship_name VARCHAR(5) NOT NULL REFERENCES fellowship(name),
    UNIQUE (tag_name, fellowship_name)
 
);

INSERT INTO tags (tag_name,fellowship_name) VALUES ('health','SAA');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(250) NULL,
    password_salt VARCHAR(250) NULL,
    fellowship_name VARCHAR(5) REFERENCES fellowship(name),
    email VARCHAR(255) UNIQUE,
    cell VARCHAR(25)
);

INSERT INTO users (name, email, password_hash,fellowship_name) values ('tyler','tylerm007@gmail.com','p','SAA');

CREATE TABLE circle (
	circle_type VARCHAR(10) NOT NULL CHECK (circle_type in ('Inner','Middle','Outer')),
	decription TEXT,
	PRIMARY KEY (circle_type)
	
);

INSERT INTO circle (circle_type,decription) values ('Inner','The addict lists behaviors they want to stop engaging in in the inner-most circle. Engaging in any of these "inner circle" or "bottom-line" behaviors would result in a loss of sobriety for the addict. Addicts typically consider their "sobriety date" to be the last day they engaged in these "inner circle" behaviors.');

INSERT INTO circle (circle_type,decription) values ('Middle','The addict then lists "middle line" or "boundary behaviors" in the second or "middle circle." These include behaviors that may or may not be appropriate but lead to the bottom line behaviors listed in the inner circle. Examples of middle-circle behaviors include not getting enough sleep, overwork, procrastination, etc');

INSERT INTO circle (circle_type,decription) values ('Outer','Finally, the addict list their "top lines" or healthy behaviors in the "outer circle." These "outer circle" behaviors lead the addict away from the objectionable behavior listed in the inner circle. Examples include going to a recovery meeting, calling one''s sponsor or other person in the addict''s support group, spiritual reading, recovery writing, etc. This visual image of three circles can help addicts realize when they are in trouble and what they need to do to move closer to their definition of a healthy behavior.');

CREATE TABLE cardtype (
   card_type VARCHAR(20) PRIMARY KEY
);

INSERT INTO cardtype VALUES ('true_false');
INSERT INTO cardtype VALUES ('free');
INSERT INTO cardtype VALUES ('range');

CREATE TABLE card (
    id SERIAL PRIMARY KEY,
    fellowship_name VARCHAR(5) REFERENCES fellowship(name) ON DELETE CASCADE,
    circle_text TEXT NOT NULL,
    card_type VARCHAR(10) REFERENCES cardtype(card_type),
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO card (fellowship_name,card_type, circle_text) values ('SAA','free','Attend an SAA meeting');
INSERT INTO card (fellowship_name,card_type, circle_text) values ('SAA','free','Go for a walk');

CREATE TABLE card_tag (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL REFERENCES card(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id)
);

INSERT INTO card_tag (card_id, tag_id) VALUES (3,1);
INSERT INTO card_tag  (card_id, tag_id) VALUES (4, 1);

CREATE TABLE card_selection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_id INTEGER REFERENCES card(id),
    circle_type VARCHAR(10) REFERENCES circle(circle_type),
    selected_date DATE NOT NULL DEFAULT current_timestamp,
    UNIQUE (user_id, card_id, circle_type)
);
INSERT INTO card_selection (user_id, card_id, circle_type) values (1,3,'Outer');
INSERT INTO card_selection (user_id, card_id, circle_type) values (1,4,'Outer');

-- Rule insert paret if none
CREATE TABLE daily_response_count (
	user_id INTEGER NOT NULL,
	response_date DATE NOT NULL,
	count_inner  INTEGER DEFAULT 0, -- any
	count_middle INTEGER DEFAULT 0, -- if boolean true
	count_outer  INTEGER DEFAULT 0,  -- any
	PRIMARY KEY (user_id, response_date)
);
-- INSERT INTO daily_question_selection (user_id,question_id) values (1,1);

CREATE TABLE response (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_id INTEGER REFERENCES card(id),
    response_date DATE NOT NULL DEFAULT current_timestamp,
    circle_type VARCHAR(20),
    response_text TEXT,
    response_bool BOOLEAN,
    response_range INTEGER ,
    UNIQUE (user_id, card_id, response_date),
    FOREIGN KEY (user_id, response_date) REFERENCES daily_response_count(user_id, response_date)
);






