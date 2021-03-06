import cgi
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
	'''
	The main page for roommate task management.
	'''
	def get(self):
		if users.get_current_user():
		  url = users.create_logout_url(self.request.uri)
		  url_linktext = 'Logout'
		else:
		  url = users.create_login_url(self.request.uri)
		  url_linktext = 'Login'
			
		template_values = {
			'url': url,
			'url_linktext': url_linktext,
			}
		
		path = os.path.join(os.path.dirname(__file__), 'tasks.html')
		self.response.out.write(template.render(path, template_values))

application = webapp.WSGIApplication(
									[('/tasks', MainPage),],
									 debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()