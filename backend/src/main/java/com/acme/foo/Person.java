package com.acme.foo;

import java.util.Date;

public class Person {
	public int id;
	public String firstname;
	public String lastname;
	
	public Date createdAt;
	
	public Object modifiedAt;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Object getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(Object modifiedAt) {
		this.modifiedAt = modifiedAt;
		System.out.println("Type of modifiedAt: " + this.modifiedAt.getClass());
	}
	
	public String toString() {
		// Method[] methods = this.getClass().getDeclaredMethods();
		// for(Method m: methods) {
		// 	if(m.getName().startsWith("get")) {
		// 		try {
		// 			System.out.println("Return value of [" + m.getName() + "]: [" + m.invoke(this) + "]");
		// 		} catch (IllegalAccessException e) {
		// 			// TODO Auto-generated catch block
		// 			e.printStackTrace();
		// 		} catch (IllegalArgumentException e) {
		// 			// TODO Auto-generated catch block
		// 			e.printStackTrace();
		// 		} catch (InvocationTargetException e) {
		// 			// TODO Auto-generated catch block
		// 			e.printStackTrace();
		// 		}
		// 	}
		// }
		return this.getFirstname() + " " + this.getLastname();
	}
}
