import cgi
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
	'''
	The main landing page. Serves prospective tenants and current tenants.
	'''
	def get(self):
		if users.get_current_user():
		  url = users.create_logout_url(self.request.uri)
		  url_linktext = 'Logout'
		else:
		  url = users.create_login_url(self.request.uri)
		  url_linktext = 'Login'
			
		template_data = {
			'url': url,
			'url_linktext': url_linktext,
			}
		
		path = os.path.join(os.path.dirname(__file__), 'index.html')
		self.response.out.write(template.render(path, template_values))
		
class HomeSetup(webapp.RequestHandler):
	'''
	Sets up a new home.
	'''
	def post(self):
		'''
		In: street1, street2, city, state, zip
		Out: request for basic home info?
		'''
		pass

application = webapp.WSGIApplication(
									[('/', MainPage),
									 ('/setup', HomeSetup)],
									 debug=True)
		
def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()