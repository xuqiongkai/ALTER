.DEFAULT_GOAL := help


### QUICK
# ¯¯¯¯¯¯¯

install: server.install ## Install

start: server.start

clean_before_recreate:
	rm -f migrations/versions/*.py
	rm -f data/app.db

seed:
	python src/manage.py seed

# recreate: clean_before_recreate database.migrate database.upgrade seed
        

# daemon: server.daemon ## Start

# stop: server.stop ## Stop


include makefiles/server.mk
# include makefiles/test.mk
include makefiles/database.mk
# include makefiles/format.mk
include makefiles/help.mk
