

build: prepare pack linux windows dist
	
clean:
	rm -rf build

prepare: clean
	mkdir -p build/linux
	mkdir -p build/windows

pack:
	cd src && zip ../simone.nw ./*


linux:
	cat ~/Apps/nw/nw ./simone.nw > build/linux/simone
	chmod +x build/linux/simone
	cp ~/Apps/nw/*.so build/linux
	cp ~/Apps/nw/*.pak build/linux
	cp ~/Apps/nw/*.dat build/linux
	cp conf_example/conf.json build/linux/ || :

windows:
	cat ~/Apps/nw-win/nw.exe ./simone.nw > build/windows/simone.exe
	cp ~/Apps/nw-win/*.pak build/windows
	cp ~/Apps/nw-win/*.dat build/windows
	cp ~/Apps/nw-win/*.dll build/windows
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
