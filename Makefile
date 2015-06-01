NWWIN=~/Apps/nw-win/
NWLINUX=~/Apps/nw

build: prepare pack linux windows
	
clean:
	rm -rf build dist simone.nw

prepare: clean
	mkdir -p build/linux
	mkdir -p build/windows

pack:
	cd src && zip ../simone.nw ./*


linux:
	cat $(NWLINUX)/nw ./simone.nw > build/linux/simone
	chmod +x build/linux/simone
	cp $(NWLINUX)/*.so build/linux
	cp $(NWLINUX)/*.pak build/linux
	cp $(NWLINUX)/*.dat build/linux
	cp conf_example/conf.json build/linux/ || :

windows:
	cat $(NWWIN)/nw.exe ./simone.nw > build/windows/simone.exe
	cp $(NWWIN)/*.pak build/windows
	cp $(NWWIN)/*.dat build/windows
	cp $(NWWIN)/*.dll build/windows
	cp conf_example/conf.json build/windows || :

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
	mv simone.nw build
