/**
 * @license
 * Copyright 2018, Instituto Federal do Rio Grande do Sul (IFRS)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package edu.ifrs.cooperativeeditor.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.PUT;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import edu.ifrs.cooperativeeditor.dao.DataObject;
import edu.ifrs.cooperativeeditor.model.User;

@WebServlet("/login-api")
public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	private static final Logger log = Logger.getLogger(LoginServlet.class.getName());

	@EJB
	private DataObject dao;

	//The PUT method is used to create a new user or update an existing one
	@PUT
	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		BufferedReader reader = request.getReader();
		StringBuilder json = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null) {
			json.append(line);
		}

		Gson gson = new Gson();
		User user = gson.fromJson(json.toString(), User.class);
		JsonObject responseData = new JsonObject();
		User userToUpdate = null;
		boolean loggedIn = request.getSession().getAttribute("userId") != null;

		//Update the logged in user, if there is one
		if (loggedIn) {
			String idUser = request.getSession().getAttribute("userId").toString();
			userToUpdate = dao.getUser(Long.valueOf(idUser));
		}

		if (userToUpdate == null) { //Creating a new user
			if (dao.getUser(user.getEmail()) != null) {
				//A user with the requested email address already exists
				responseData.addProperty("isUserValid", false);
				responseData.addProperty("emailInUse", true);
			} else {
				dao.mergerUser(user);
				responseData.addProperty("isUserValid", true);
			}

			log.log(Level.INFO, "LoginServlet method doPUT new User ");			
		} else { //Updating an existing user
			userToUpdate.setEmail(user.getEmail());
			userToUpdate.setName(user.getName());
			userToUpdate.setPassword(user.getPassword());
			dao.mergerUser(userToUpdate);
			responseData.addProperty("isUserValid", true);

			log.log(Level.INFO, "LoginServlet method doPUT merger User ");
		}

		response.getWriter().write(responseData.toString());
	}

	//The GET method is used to log out the user
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		JsonObject responseData = new JsonObject();

		request.getSession().removeAttribute("userId");
		request.getSession().removeAttribute("name");
		request.getSession().invalidate();
		
		log.log(Level.INFO, "LoginServlet method doGET AttributeNames: " + request.getSession().getAttributeNames());
		responseData.addProperty("isLogoutValid", true);
		response.getWriter().write(responseData.toString());
	}

	//The POST method is used to log in or check if the user is logged in
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		BufferedReader reader = request.getReader();
		StringBuilder json = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null) {
			json.append(line);
		}

		boolean checkLogin = false;
		String email = null;
		String password = null;
		JsonObject requestData = new JsonParser().parse(json.toString()).getAsJsonObject();
		JsonObject responseData = new JsonObject();

		try {
			checkLogin = requestData.get("checkLogin").getAsBoolean();
		} catch (Exception e) {
			//Do nothing
		}

		try {
			email = requestData.get("useremail").getAsString();
			password = requestData.get("password").getAsString();
		} catch (Exception e) {
			// TODO Exception
		}

		response.setContentType("application/json");

		if (checkLogin) { //Just checking if a user is logged in
			boolean loggedIn = request.getSession().getAttribute("userId") != null;
			responseData.addProperty("isLoggedIn", loggedIn);
		} else { //Actually logging in
			User user = dao.getUser(email, password);
			if (user != null) {
				request.getSession().setAttribute("userId", user.getId());
				request.getSession().setAttribute("name", user.getName());

				responseData.addProperty("isLoginValid", true);

				if (request.getSession().getAttribute("urlBeforeRedirect") != null) {
					String url = request.getSession().getAttribute("urlBeforeRedirect").toString();
					responseData.addProperty("urlRedirect", url);
				}

			} else {
				responseData.addProperty("isLoginValid", false);
			}
		}
		
		log.log(Level.INFO, "LoginServlet method doPOST AttributeNames: " + request.getSession().getAttributeNames());
		
		response.getWriter().write(responseData.toString());
	}
}
