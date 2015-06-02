NWWIN=~/Apps/nw-win/
NWLINUX=~/Apps/nw
VERSION=`cat VERSION`

build: prepare pack linux windows
	
clean:
	rm -rf build dist simone.nw

version:
	@echo $(VERSION)

prepare-dev:
	sed 's/@TOOLBAR/true/' package-tpl.json > src/package.json
	sed -i "s/@VERSION/$(VERSION)-dev/" src/package.json

prepare: clean
	mkdir -p build/linux
	mkdir -p build/windows
	sed 's/@TOOLBAR/false/' package-tpl.json > src/package.json
	sed -i "s/@VERSION/$(VERSION)/" src/package.json

pack:
	cd src && zip -r ../simone.nw *.html *.js *.wav *.css *.png *.json ./ace/src-min-noconflict

linux:
	cat $(NWLINUX)/nw ./simone.nw > build/linux/simone
	chmod +x build/linux/simone
	cp $(NWLINUX)/*.so build/linux
	cp $(NWLINUX)/*.pak build/linux
	cp $(NWLINUX)/*.dat build/linux

windows:
	cat $(NWWIN)/nw.exe ./simone.nw > build/windows/simone.exe
	cp $(NWWIN)/*.pak build/windows
	cp $(NWWIN)/*.dat build/windows
	cp $(NWWIN)/*.dll build/windows

dist:
	mkdir dist
	cd build/ && \
	cp -r linux simone && \
	tar cfz simone-v0.1.tgz simone && \
	rm -rf simone
	cd build && \
	cp -r windows simone && \
	zip -r simone-v0.1.zip simone && \
	rm -rf simone
	mv build/*.tgz build/*.zip dist/
	mv simone.nw dist
