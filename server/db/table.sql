CREATE TABLE `users` (
    id int(10) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(50) NOT NULL,
    
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE TABLE post (
	id int(10) NOT NULL AUTO_INCREMENT,
    id_user int(10) NOT NULL,
    title varchar(100) NOT NULL,
    `desc` MEDIUMTEXT,
    image MEDIUMTEXT NOT NULL,
    thumbUrl MEDIUMTEXT NOT NULL,
    hashimage MEDIUMTEXT NOT NULL,
    
    PRIMARY KEY(id),
    FOREIGN KEY (id_user) REFERENCES `users`(id)
);

CREATE TABLE like_post (
    id_user int(10) NOT NULL,
    id_post int(10) NOT NULL,

    FOREIGN KEY (id_user) REFERENCES `users`(id) ON DELETE CASCADE,
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE similar_post (
	id_post int(10) NOT NULL,
    id_post_similar int(10) NOT NULL,
    percentage FLOAT DEFAULT 0.0,
    
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (id_post_similar) REFERENCES post(id) ON DELETE CASCADE
);