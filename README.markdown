# simple-gallery ![project-status](http://stillmaintained.com/paps/simple-gallery.png)#

How to
------

Can be made accessible with any basic HTTP server, for example:

	python -m SimpleHTTPServer (execute in project root directory)

To add images & videos, edit 'js/items.js' (ignored by git):

	gItems = [
		{
			/*
			   'image' or 'video'
			 */
			type: 'image',
			
			/*
			   name of the file (must exist in directories 'photos/' and
			   'photos/thumbs/' if it's an image, and in 'videos/' if it's a
			   video)
			 */
			file: '2013-05-01_20h16m19s_nikon.jpg',
			
			/*
			   caption to be displayed above the item and as title in the
			   thumbnail gallery
			*/
			caption: '2013/05/01 20h16m19s',
			
			/*
			   integer trip day number (must always be the same or greater than
			   the preceding day number, starting from 1 - if there was no days
			   or if this value is unknown, put 1 everywhere)
			*/
			day: 1
		},
		{ type: 'image', file: 'photo1020.jpg',  caption: 'Hey!', day: 1 },
		{ type: 'video', file: 'video1020.ogv', caption: 'Video', day: 1 },
		{ type: 'video', file: 'video1030.ogv', caption: 'Bar', day: 2 },
		{ type: 'image', file: 'photo1040.jpg',  caption: 'Foo', day: 2 },
	];

The order of objects in gItems is important. The array will be used as is for displaying items.

Image files must be stored in 'photos/' (directory ignored by git). Images must be scaled down to 1000x1000 or less. For each image, a corresponding thumbnail must exist with the same name, stored in 'photos/thumbs/'. The thumbnail size must not exceed 100x100.

Video files must be stored in 'videos/' (directory ignored by git). Videos must be scaled down to 1280x720 or less and be in a format supported by HTML5 video.

You must also edit 'js/settings.js' (ignored by git):

	gSettings = {
		title: 'Your gallery page title',
	};


Useful tips for managing large amount of photos & videos
--------------------------------------------------------

Some useful packages in Ubuntu:

	libimage-exiftool-perl - Library and program to read and write meta information in multimedia files (binary: exiftool)
	jhead - manipulate the non-image part of Exif compliant JPEG files
	ffmpeg - Multimedia player, server, encoder and transcoder
	imagemagick - image manipulation programs (binaries: mogrify, convert)
	eog - Eye of GNOME graphics viewer program

Convert all files in directory to 480p ogg video compatible with all major
browsers HTML5 video:

	for i in `ls` ; do ffmpeg -i $i -s 720x480 -b 1750k -acodec libvorbis -ac 2 -ab 96k -ar 44100 $i.ogv ; done

Scale down all files in directory to 1000x800 (erases the originals!):

	for i in `ls` ; do mogrify -verbose -scale 1000x800 $i ; done

Rotate all JPEG files in directory according to Exif information:

	jhead -autorot *.jpg

Show Exif information for any photo or video:

	exiftool file.jpg

Manually rotate photos (ctrl-R to rotate, click 'Save' when exiting):

	eog *.jpg

Create thumbnails for all JPEG files in directory:

	mkdir thumbs
	for i in `ls *.jpg` ; do convert -verbose -scale 100x80 $i thumbs/$i ; done

Add 7 hours to Exif time to all JPEG files in directory:

	jhead -ta+7:00 *.jpg

Set file modification time to Exif time for all JPEG files in directory:

	jhead -ft *.jpg
