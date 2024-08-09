package com.acme.foo;

import java.io.ByteArrayInputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/persons")
public class PersonApi {

	private static final Logger logger = LogManager.getLogger(PersonApi.class);

	@Autowired
	PersonApi() {
		;
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = { "application/json;charset=UTF-8" })
	public ResponseEntity<Person> getPerson(@PathVariable String id) {
		try {
			final Person p = new Person();
			p.setId(1);
			p.setFirstname("John");
			p.setLastname("Doe");
			logger.info("Info log get person"+p.firstname);
			final Date d = Calendar.getInstance().getTime();
			p.setCreatedAt(d);
			p.setModifiedAt(d);
			return new ResponseEntity<Person>(p, HttpStatus.OK);
		} catch (Exception enfe) {
			return new ResponseEntity<Person>(HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Receives JSON as application/json, deserialized by Spring into a Person object passed as method param.
	 * @param person the person as deserialized by Spring
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = {
			"application/json;charset=UTF-8" }, produces = { "application/json;charset=UTF-8" })
	public ResponseEntity<Person> postPersonAsJson(@RequestBody Person person) {
		try {
			logger.info("Received JSON, deserialized by Spring, for person " + person.firstname);
			return new ResponseEntity<Person>(HttpStatus.OK);
		} catch (Exception enfe) {
			return new ResponseEntity<Person>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Receives YAML as text/plain, and deserializes it using snakeyaml.
	 * @param yaml the YAML to be deserialized
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = {
		"text/plain;charset=UTF-8" }, produces = { "application/json;charset=UTF-8" })
	public ResponseEntity<Person> postPersonAsYaml(@RequestBody String yamlAsString) {
		try {
			// Using Jackson
			// ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
			// Person person = mapper.readValue(yamlAsString, Person.class);

			// Using snakeyaml
            Yaml yaml = new Yaml(new Constructor(Person.class));
            Person person = yaml.load(new ByteArrayInputStream(yamlAsString.getBytes()));

			logger.info("Received YAML, deserialized in controller, for person " + person.firstname);
			return new ResponseEntity<Person>(HttpStatus.OK);
		} catch(Exception enfe) {
			logger.error("Caught exception: " + enfe.getMessage());
			return new ResponseEntity<Person>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}