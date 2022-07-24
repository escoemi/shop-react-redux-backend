create table products (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text not null,
	price integer not null
);

create table stocks(
	id uuid not null default uuid_generate_v4() primary key,
	product_id uuid not null references products(id),
	"count" integer not null
);

insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa','Tiguan', 'Tiguan', '549990');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a0','Nivus', 'Nivus', '474990');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a2','T-CROSS', 'T-CROSS', '419990');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a1','Polo', 'Polo', '263921');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a3','Vento', 'Vento', '272421');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9345-fc73348a80a1','Virtus', 'Virtus', '350990');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9345-fc73348a80a1', 8);
insert into products (id, title, description, price) values ('7567ec4b-b10c-48c5-9445-fc73c48a80a2','Jetta', 'Jetta', '379990');
insert into stocks (product_id, count) values ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 2);
insert into products (id, title, description, price) values ('7567ec4b-b10c-45c5-9345-fc73c48a80a1','Amarok', 'Amarok', '799500');
insert into stocks (product_id, count) values ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 3);