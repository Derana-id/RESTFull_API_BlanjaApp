--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-06-09 23:18:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 84998)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id uuid NOT NULL,
    user_id uuid,
    label character varying(255),
    recipent_name character varying(255),
    recipient_phone character varying(50),
    address text,
    postal_code integer,
    city character varying(255),
    is_primary integer,
    is_active integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 85012)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid NOT NULL,
    user_id uuid,
    product_id uuid,
    qty integer,
    is_active integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 85027)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid NOT NULL,
    category_name character varying(255),
    photo character varying(255),
    is_active integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 84983)
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    id uuid NOT NULL,
    sender uuid NOT NULL,
    receiver uuid NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 85034)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id uuid NOT NULL,
    store_id uuid,
    category_id uuid,
    product_name character varying(255),
    brand_id uuid,
    price integer,
    is_new integer,
    description text,
    stock integer,
    rating integer,
    is_active integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 85054)
-- Name: product_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_brand (
    id uuid NOT NULL,
    brand_name character varying(255),
    photo character varying(255),
    is_active integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.product_brand OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 85049)
-- Name: product_color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_color (
    id uuid NOT NULL,
    product_id uuid,
    color_name character varying(50),
    color_value character varying(50),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.product_color OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 85044)
-- Name: product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_image (
    id uuid NOT NULL,
    product_id uuid,
    photo character varying(255),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.product_image OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 85041)
-- Name: product_size; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_size (
    id uuid NOT NULL,
    product_id uuid,
    size character varying(2),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.product_size OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 85088)
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255),
    phone character varying(50),
    gender character varying(10),
    birth date,
    photo character varying(255),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 85081)
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id uuid NOT NULL,
    user_id uuid,
    name character varying(255),
    store_name character varying(255),
    store_phone character varying(50),
    store_description text,
    photo character varying(255),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.store OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 85017)
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    id uuid NOT NULL,
    user_id uuid,
    invoice character varying(255),
    date timestamp without time zone,
    total integer,
    payment_method integer,
    status integer,
    city character varying(255),
    postal_code integer,
    address text,
    recipient_name character varying(255),
    recipient_phone character varying(50),
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 85022)
-- Name: transaction_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_detail (
    id uuid NOT NULL,
    transaction_id uuid,
    product_id uuid,
    price integer,
    qty integer,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.transaction_detail OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 84976)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    level integer NOT NULL,
    token character varying(255),
    is_verified integer NOT NULL,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN users.level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.level IS '0 = Admin
1 = Seller
2 = Buyer';


--
-- TOC entry 3380 (class 0 OID 84998)
-- Dependencies: 211
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3381 (class 0 OID 85012)
-- Dependencies: 212
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3384 (class 0 OID 85027)
-- Dependencies: 215
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.category (id, category_name, photo, is_active, "createdAt", "updatedAt") VALUES ('e7382a02-fd05-4b1d-a8bc-0dd24b44c993', 'Smartphone', 'default.png', NULL, NULL, NULL);


--
-- TOC entry 3379 (class 0 OID 84983)
-- Dependencies: 210
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3385 (class 0 OID 85034)
-- Dependencies: 216
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (id, store_id, category_id, product_name, brand_id, price, is_new, description, stock, rating, is_active, "createdAt", "updatedAt") VALUES ('05cfabf5-e163-4d7e-9616-268587e33f44', 'd8d7fb3b-4ebd-4e35-a588-78a5dd4f263d', 'e7382a02-fd05-4b1d-a8bc-0dd24b44c993', 'Samdung Galaxy', 'bf233b47-0d5f-4344-aba1-4e4be48974ec', 120000, 1, 'Lorem ipsum..', 12, 9, NULL, NULL, NULL);
INSERT INTO public.product (id, store_id, category_id, product_name, brand_id, price, is_new, description, stock, rating, is_active, "createdAt", "updatedAt") VALUES ('28ffa739-6e16-4b4d-b8b5-ef30e10d3f71', 'd8d7fb3b-4ebd-4e35-a588-78a5dd4f263d', 'e7382a02-fd05-4b1d-a8bc-0dd24b44c993', 'Celana', 'bf233b47-0d5f-4344-aba1-4e4be48974ec', 120000, 1, 'Lorem ipsum..', 12, 9, 0, NULL, '2022-06-09 10:18:44.352');
INSERT INTO public.product (id, store_id, category_id, product_name, brand_id, price, is_new, description, stock, rating, is_active, "createdAt", "updatedAt") VALUES ('7d6b1f7a-3ec8-477d-88fa-8b11db3ca07e', 'd8d7fb3b-4ebd-4e35-a588-78a5dd4f263d', 'e7382a02-fd05-4b1d-a8bc-0dd24b44c993', 'Samdung Galaxy', 'bf233b47-0d5f-4344-aba1-4e4be48974ec', 120000, 1, 'Lorem ipsum..', 12, 9, 1, '2022-06-09 10:20:10.717', '2022-06-09 10:20:10.717');
INSERT INTO public.product (id, store_id, category_id, product_name, brand_id, price, is_new, description, stock, rating, is_active, "createdAt", "updatedAt") VALUES ('232fd85b-1302-4ff8-a328-a161a0f01f33', '6f666eee-433a-4f09-b30c-efafdbd428da', 'e7382a02-fd05-4b1d-a8bc-0dd24b44c993', 'Samdung Galaxy A+', 'bf233b47-0d5f-4344-aba1-4e4be48974ec', 120000, 1, 'Lorem ipsum..', 12, 9, 1, '2022-06-09 15:33:17.476', '2022-06-09 15:33:17.476');


--
-- TOC entry 3389 (class 0 OID 85054)
-- Dependencies: 220
-- Data for Name: product_brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_brand (id, brand_name, photo, is_active, "createdAt", "updatedAt") VALUES ('bf233b47-0d5f-4344-aba1-4e4be48974ec', 'Samsung', 'default.png', NULL, NULL, NULL);


--
-- TOC entry 3388 (class 0 OID 85049)
-- Dependencies: 219
-- Data for Name: product_color; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_color (id, product_id, color_name, color_value, "createdAt", "updatedAt") VALUES ('b214b533-88aa-4210-bd63-f32d6f0bee6c', '05cfabf5-e163-4d7e-9616-268587e33f44', 'Red', '#F00', '2022-06-09 08:13:51.085', '2022-06-09 08:13:51.085');
INSERT INTO public.product_color (id, product_id, color_name, color_value, "createdAt", "updatedAt") VALUES ('2c888836-633f-4e6e-8079-59db9886f3bd', '28ffa739-6e16-4b4d-b8b5-ef30e10d3f71', 'Red', '#F00', '2022-06-09 08:25:34.078', '2022-06-09 08:25:34.078');
INSERT INTO public.product_color (id, product_id, color_name, color_value, "createdAt", "updatedAt") VALUES ('27d8beae-1f48-48f1-96d3-7f4b35fd3bdd', '7d6b1f7a-3ec8-477d-88fa-8b11db3ca07e', 'Red', '#F00', '2022-06-09 10:20:14.165', '2022-06-09 10:20:14.165');
INSERT INTO public.product_color (id, product_id, color_name, color_value, "createdAt", "updatedAt") VALUES ('debe596c-bf34-409d-af4a-dae44d259f35', '232fd85b-1302-4ff8-a328-a161a0f01f33', 'Red', '#F00', '2022-06-09 15:33:17.802', '2022-06-09 15:33:17.802');


--
-- TOC entry 3387 (class 0 OID 85044)
-- Dependencies: 218
-- Data for Name: product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_image (id, product_id, photo, "createdAt", "updatedAt") VALUES ('7d60f728-36f1-46ba-907e-b64355338576', '28ffa739-6e16-4b4d-b8b5-ef30e10d3f71', 'default.png', '2022-06-09 08:25:34.136', '2022-06-09 08:25:34.136');
INSERT INTO public.product_image (id, product_id, photo, "createdAt", "updatedAt") VALUES ('ac44197b-372f-4aea-b5d9-ce9c77c37ccf', '7d6b1f7a-3ec8-477d-88fa-8b11db3ca07e', 'default.png', '2022-06-09 10:20:14.167', '2022-06-09 10:20:14.167');
INSERT INTO public.product_image (id, product_id, photo, "createdAt", "updatedAt") VALUES ('26134a4c-b2c5-4f40-8ec7-8814c1b407f9', '232fd85b-1302-4ff8-a328-a161a0f01f33', 'default.png', '2022-06-09 15:33:17.805', '2022-06-09 15:33:17.805');


--
-- TOC entry 3386 (class 0 OID 85041)
-- Dependencies: 217
-- Data for Name: product_size; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('bbd47b08-1c2b-403d-b274-ee043667de4f', '28ffa739-6e16-4b4d-b8b5-ef30e10d3f71', 'XL', '2022-06-09 08:25:34.286', '2022-06-09 08:25:34.286');
INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('ac259de5-8268-4206-9d4b-36f0bbd9cfde', '28ffa739-6e16-4b4d-b8b5-ef30e10d3f71', 'M', '2022-06-09 08:25:34.288', '2022-06-09 08:25:34.288');
INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('b74f73f9-2a89-4279-83d5-3dbce40651f8', '7d6b1f7a-3ec8-477d-88fa-8b11db3ca07e', 'L', '2022-06-09 10:20:14.168', '2022-06-09 10:20:14.168');
INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('ed46371f-2167-49bf-8907-95c66f3dcc2b', '7d6b1f7a-3ec8-477d-88fa-8b11db3ca07e', 'M', '2022-06-09 10:20:14.173', '2022-06-09 10:20:14.173');
INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('d2fad4c5-7747-48bb-953f-ff6d2f7b0d1c', '232fd85b-1302-4ff8-a328-a161a0f01f33', 'L', '2022-06-09 15:33:17.809', '2022-06-09 15:33:17.809');
INSERT INTO public.product_size (id, product_id, size, "createdAt", "updatedAt") VALUES ('e80024f7-4709-428f-b500-3b5fb2970248', '232fd85b-1302-4ff8-a328-a161a0f01f33', 'M', '2022-06-09 15:33:17.811', '2022-06-09 15:33:17.811');


--
-- TOC entry 3391 (class 0 OID 85088)
-- Dependencies: 222
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profile (id, user_id, name, phone, gender, birth, photo, "createdAt", "updatedAt") VALUES ('b738364f-9aa4-421b-a271-57900fc1f244', 'b25a765a-5ff9-40c3-8d69-a2393d0586e1', 'Muhammad Alif Putra', '081245162134', 'Male', '2022-12-30', '1654750412993.png', '2022-06-09 04:40:41.404', '2022-06-09 04:53:35.049');


--
-- TOC entry 3390 (class 0 OID 85081)
-- Dependencies: 221
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.store (id, user_id, name, store_name, store_phone, store_description, photo, "createdAt", "updatedAt") VALUES ('f789f544-28fd-4fe7-83a4-c254b1ddc60c', 'fc0cfd7c-3991-4cfc-bc35-2076d3bbb5a5', 'Muhammad Alif', 'Derana.id', '081325147142', NULL, NULL, '2022-06-09 04:58:30.736', '2022-06-09 04:58:30.736');
INSERT INTO public.store (id, user_id, name, store_name, store_phone, store_description, photo, "createdAt", "updatedAt") VALUES ('6f666eee-433a-4f09-b30c-efafdbd428da', 'd8d7fb3b-4ebd-4e35-a588-78a5dd4f263d', 'Muhammad Alif Putra S', 'Derana.id', '081325147145', 'Lorem ipsum', '1654751578377.png', '2022-06-09 05:02:55.191', '2022-06-09 05:13:00.236');


--
-- TOC entry 3382 (class 0 OID 85017)
-- Dependencies: 213
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3383 (class 0 OID 85022)
-- Dependencies: 214
-- Data for Name: transaction_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3378 (class 0 OID 84976)
-- Dependencies: 209
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password, level, token, is_verified, "createdAt", "updatedAt") VALUES ('b25a765a-5ff9-40c3-8d69-a2393d0586e1', 'masterprogrammer123@gmail.com', '$2b$10$Mdk7AuFXVg56NH3jIBU9gOLNQmk5rerQTGhh1bTfLwb9oe4ggzR4e', 2, NULL, 1, '2022-06-09 04:40:41.051', '2022-06-09 04:53:35.183');
INSERT INTO public.users (id, email, password, level, token, is_verified, "createdAt", "updatedAt") VALUES ('fc0cfd7c-3991-4cfc-bc35-2076d3bbb5a5', 'muhammadalifputra8888@gmail.com', '$2b$10$fMj3QcbMVIXWIz17g8C/Ruv4sJsb2E.5QZKvpkM685UHHKExc0FLG', 1, '79549295a48ee9db3699b08941cdaa7de522cfce1cdb3012363a2a9fed36', 0, '2022-06-09 04:58:30.558', '2022-06-09 04:58:30.558');
INSERT INTO public.users (id, email, password, level, token, is_verified, "createdAt", "updatedAt") VALUES ('d8d7fb3b-4ebd-4e35-a588-78a5dd4f263d', 'arsyoungsterzone@gmail.com', '$2b$10$ybIpxyutP/vSjDauf3cZzeE6e5uG0TlWeqYEouwBi.gD.AJHmR8GC', 1, NULL, 1, '2022-06-09 05:02:55.054', '2022-06-09 05:13:00.474');


--
-- TOC entry 3220 (class 2606 OID 85004)
-- Name: address address_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey1 PRIMARY KEY (id);


--
-- TOC entry 3222 (class 2606 OID 85016)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 85033)
-- Name: category categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 84990)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 85060)
-- Name: product_brand product_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_brand
    ADD CONSTRAINT product_brand_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 85053)
-- Name: product_color product_color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_color
    ADD CONSTRAINT product_color_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 85048)
-- Name: product_image product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3230 (class 2606 OID 85040)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 3232 (class 2606 OID 85087)
-- Name: product_size product_size_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_size
    ADD CONSTRAINT product_size_pkey PRIMARY KEY (id);


--
-- TOC entry 3226 (class 2606 OID 85026)
-- Name: transaction_detail transaction_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_pkey PRIMARY KEY (id);


--
-- TOC entry 3224 (class 2606 OID 85021)
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- TOC entry 3216 (class 2606 OID 84982)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


-- Completed on 2022-06-09 23:19:17

--
-- PostgreSQL database dump complete
--

