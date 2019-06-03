
from pytube import YouTube, Playlist
import click
import os


@click.command()
@click.option('--url', prompt='Enter YouTube Video URL')
@click.option('--playlist', prompt='Playlis(y/n)') #playlist options
@click.option('--directory', prompt='Folder Name')
def download_vid(url, playlist, directory):
	try:

		if playlist == 'n':
			tube = YouTube(url).streams.first().download()
		elif playlist == 'y':
			createFolder(directory)
			tube = Playlist(url).download_all(directory)
		else:
			click.echo('Error Unspecified option')


	except Exception as e:
		click.echo('An Error has occured :' + str(e))



def createFolder(directory):
	try:
		with open(directory+'/README.txt', 'w') as f:
			f.write('After Copying the files in thi folder delete this folder.')
		if not os.path.exists(directory):
			os.makedirs(directory)
	except OSError:
			click.echo('Error Creating directory '+ str(directory))



#stdnum = 201603271
# https://www.youtube.com/watch?v=Z571ByeNbPQ&t=2s