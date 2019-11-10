create table categorie(
    id int auto_increment primary key,
    designation varchar(500)
);

create table client(
    id int auto_increment primary key,
    nom varchar(30),
    prenom varchar(30),
    refUser int,
    tel varchar(20),
    ville varchar(30),
    pays varchar(30)
);

create table user(
    id int auto_increment primary key,
    username varchar(8),
    password text,
    actif boolean default true,
    isAdmin boolean default false
);

create table produit(
    id int auto_increment primary key,
    designation varchar(500),
    descriptions text,
    img text,
    images text default null,
    datea datetime default now(),
    rates float default 0.0,
    price decimal(10,2) default 0.0,
    quantite int default 0,
    categorie int
);

alter table produit add constraint fk_cat foreign key(categorie) references categorie(id) on delete no action;


create table etat(
    id int primary key,
    designation varchar(250)
);

insert into etat values(1, 'en attente de paiement');
insert into etat values(2, 'encours de livraison');
insert into etat values(3, 'commande en attente de validation.');

create table commande(
    id int auto_increment primary key,
    client int,
    produit int,
    quantite int default 1,
    datec datetime default now(),
    etat int default 1
);
alter table commande add constraint fk_com_client foreign key(client) references client(id);
alter table commande add constraint fk_detail_etat foreign key(etat) references etat(id);

create table paiement(
    commande int,
    montant decimal(10, 2) default 0.0,
    datep datetime default now(),
    methode text 
);
alter table paiement add constraint fk_paiement_commande foreign key(commande) references commande(id);

