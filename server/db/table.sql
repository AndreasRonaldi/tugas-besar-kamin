CREATE TABLE `users` (
    id int(10) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(50) NOT NULL,
    
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE TABLE post (
	id int(10) NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    `desc` MEDIUMTEXT,
    image MEDIUMBLOB NOT NULL,
    hashimage MEDIUMTEXT NOT NULL,
    
    PRIMARY KEY(id)
);

CREATE TABLE similar_post (
	id_post int(10) NOT NULL,
    id_post_similar int(10) NOT NULL,
    percentage FLOAT DEFAULT 0.0,
    
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (id_post_similar) REFERENCES post(id)
);