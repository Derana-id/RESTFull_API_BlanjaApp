--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-06-08 11:43:51

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
-- TOC entry 212 (class 1259 OID 84998)
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
    is_primary integer
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 85012)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid NOT NULL,
    user_id uuid,
    product_id uuid,
    qty integer
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 85027)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid NOT NULL,
    category_name character varying(255),
    photo character varying(255)
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
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 85034)
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
    rating integer
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 85054)
-- Name: product_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_brand (
    id uuid NOT NULL,
    brand_name character varying(255),
    photo character varying(255)
);


ALTER TABLE public.product_brand OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 85049)
-- Name: product_color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_color (
    id uuid NOT NULL,
    product_id uuid,
    color_name character varying(50),
    color_value character varying(50)
);


ALTER TABLE public.product_color OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 85044)
-- Name: product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_image (
    id uuid NOT NULL,
    product_id uuid,
    photo character varying(255)
);


ALTER TABLE public.product_image OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 85041)
-- Name: product_size; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_size (
    id uuid,
    product_id uuid,
    size character varying(2)
);


ALTER TABLE public.product_size OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 84991)
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    phone character varying(50),
    gender integer,
    birth date,
    photo character varying
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN profile.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.profile.gender IS '0 = Male
1 = Integer';


--
-- TOC entry 213 (class 1259 OID 85005)
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id uuid NOT NULL,
    user_id uuid,
    store_name character varying(255),
    store_phone character varying(50),
    store_description text
);


ALTER TABLE public.store OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 85017)
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
    recipient_phone character varying(50)
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 85022)
-- Name: transaction_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_detail (
    id uuid NOT NULL,
    transaction_id uuid,
    product_id uuid,
    price integer,
    qty integer
);


ALTER TABLE public.transaction_detail OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 84976)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    level integer NOT NULL,
    token character varying(255),
    is_verified integer NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN "user".level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."user".level IS '0 = Admin
1 = Seller
2 = Buyer';


--
-- TOC entry 3384 (class 0 OID 84998)
-- Dependencies: 212
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3386 (class 0 OID 85012)
-- Dependencies: 214
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3389 (class 0 OID 85027)
-- Dependencies: 217
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3382 (class 0 OID 84983)
-- Dependencies: 210
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3390 (class 0 OID 85034)
-- Dependencies: 218
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3394 (class 0 OID 85054)
-- Dependencies: 222
-- Data for Name: product_brand; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3393 (class 0 OID 85049)
-- Dependencies: 221
-- Data for Name: product_color; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3392 (class 0 OID 85044)
-- Dependencies: 220
-- Data for Name: product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3391 (class 0 OID 85041)
-- Dependencies: 219
-- Data for Name: product_size; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3383 (class 0 OID 84991)
-- Dependencies: 211
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3385 (class 0 OID 85005)
-- Dependencies: 213
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3387 (class 0 OID 85017)
-- Dependencies: 215
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3388 (class 0 OID 85022)
-- Dependencies: 216
-- Data for Name: transaction_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3381 (class 0 OID 84976)
-- Dependencies: 209
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3221 (class 2606 OID 84997)
-- Name: profile address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- TOC entry 3223 (class 2606 OID 85004)
-- Name: address address_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey1 PRIMARY KEY (id);


--
-- TOC entry 3227 (class 2606 OID 85016)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 85033)
-- Name: category categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3219 (class 2606 OID 84990)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 85060)
-- Name: product_brand product_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_brand
    ADD CONSTRAINT product_brand_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 85053)
-- Name: product_color product_color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_color
    ADD CONSTRAINT product_color_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 85048)
-- Name: product_image product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 85040)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 85011)
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 85026)
-- Name: transaction_detail transaction_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 85021)
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 84982)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


-- Completed on 2022-06-08 11:44:01

--
-- PostgreSQL database dump complete
--

