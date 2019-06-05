
from pytube import YouTube, Playlist
import click
import os

@click.group()
def main():
	"""  	CMDownloader \n
	***** VERSION 0.0.1 ***** \n
		Download YouTube Videos on The termial  \n

	"""
	pass

@main.command()
@click.argument('url')
def vid(url):
	try:
		tube = YouTube(url).streams.first().download()
	except Exception as e:
		click.echo('An Error has occured :' + str(e))



def createFolder(directory):
	try:
		with open(directory+'/README.txt', 'w') as f:
			f.write('After Copying the files in thi folder delete this folder.')
		if not os.path.exists(directory):
			os.makedirs(directory)
	except Exception as e:
			click.echo('Error Creating directory '+ str(e))

@main.command()
@click.argument('url')
@click.option('--directory', '-d', prompt='Enter the folder Name', help='Directory Name')
def playlist(url, directory):
	try:
		createFolder(directory)
		tube = Playlist(url).download_all(directory)
	except Exception as e:
		click.echo('An Error has occured :' + str(e))




#stdnum = 201603271
# https://www.youtube.com/watch?v=Z571ByeNbPQ&t=2s