--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.5
-- Dumped by pg_dump version 9.5.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: location; Type: TABLE; Schema: public; Owner: kurkel
--

CREATE TABLE location (
    id integer NOT NULL,
    "time" timestamp with time zone DEFAULT now(),
    location character varying
);


ALTER TABLE location OWNER TO kurkel;

--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: kurkel
--

CREATE SEQUENCE location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE location_id_seq OWNER TO kurkel;

--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kurkel
--

ALTER SEQUENCE location_id_seq OWNED BY location.id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: kurkel
--

CREATE TABLE message (
    id integer NOT NULL,
    "time" timestamp with time zone DEFAULT now(),
    message character varying,
    location character varying
);


ALTER TABLE message OWNER TO kurkel;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: kurkel
--

CREATE SEQUENCE message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE message_id_seq OWNER TO kurkel;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kurkel
--

ALTER SEQUENCE message_id_seq OWNED BY message.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: kurkel
--

ALTER TABLE ONLY location ALTER COLUMN id SET DEFAULT nextval('location_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: kurkel
--

ALTER TABLE ONLY message ALTER COLUMN id SET DEFAULT nextval('message_id_seq'::regclass);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: kurkel
--

COPY location (id, "time", location) FROM stdin;
\.


--
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kurkel
--

SELECT pg_catalog.setval('location_id_seq', 1, false);


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: kurkel
--

COPY message (id, "time", message, location) FROM stdin;
\.


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kurkel
--

SELECT pg_catalog.setval('message_id_seq', 1, false);


--
-- Name: primary key; Type: CONSTRAINT; Schema: public; Owner: kurkel
--

ALTER TABLE ONLY message
    ADD CONSTRAINT "primary key" PRIMARY KEY (id);


--
-- Name: primary key location; Type: CONSTRAINT; Schema: public; Owner: kurkel
--

ALTER TABLE ONLY location
    ADD CONSTRAINT "primary key location" PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

