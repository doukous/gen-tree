from neo4j import GraphDatabase


class DriverExtension(object):
    def __init__(self, app=None):
        self.driver = None


    def init_app(self, app):
        self.driver = GraphDatabase.driver(
            app.config.get('URI'), 
            auth=app.config.get('AUTH')
        )
        self.driver.verify_connectivity()


db = DriverExtension()
