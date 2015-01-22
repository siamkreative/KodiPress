(function ($) {

	$(function () {

		/* Query the libraries */
		var Artists = {
			"jsonrpc": "2.0",
			"method": "AudioLibrary.GetArtists",
			"params": {
				"limits": {
					"start": 0,
					"end": 75
				},
				"properties": ["thumbnail", "fanart", "born", "formed", "died", "disbanded", "yearsactive", "mood", "style", "genre"],
				"sort": {
					"order": "ascending",
					"method": "artist",
					"ignorearticle": true
				}
			},
			"id": 1
		};
		var Albums = {
			"jsonrpc": "2.0",
			"method": "AudioLibrary.GetAlbums",
			"params": {
				"limits": {
					"start": 0,
					"end": 50
				},
				"properties": ["playcount", "artist", "genre", "rating", "thumbnail", "year", "mood", "style"],
				"sort": {
					"order": "ascending",
					"method": "album",
					"ignorearticle": true
				}
			},
			"id": "libAlbums"
		};
		var Songs = {
			"jsonrpc": "2.0",
			"method": "AudioLibrary.GetSongs",
			"params": {
				"limits": {
					"start": 0,
					"end": 25
				},
				"properties": ["artist", "duration", "album", "track"],
				"sort": {
					"order": "ascending",
					"method": "track",
					"ignorearticle": true
				}
			},
			"id": "libSongs"
		};
		var Movies = {
			"jsonrpc": "2.0",
			"method": "VideoLibrary.GetMovies",
			"params": {
				/*"filter": {
					"field": "playcount",
					"operator": "is",
					"value": "0"
				},
				"limits": {
					"start": 0,
					"end": 75
				},*/
				"properties": ["title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "playcount", "writer", "studio", "fanart", "thumbnail", "file", "dateadded", "art", "runtime"],
				"sort": {
					"order": "ascending",
					"method": "title",
					"ignorearticle": true
				}
			},
			"id": "libMovies"
		};
		var TVShows = {
			"jsonrpc": "2.0",
			"method": "VideoLibrary.GetTVShows",
			"params": {
				"filter": {
					"field": "playcount",
					"operator": "is",
					"value": "0"
				},
				"limits": {
					"start": 0,
					"end": 75
				},
				"properties": ["art", "genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"],
				"sort": {
					"order": "ascending",
					"method": "label"
				}
			},
			"id": "libTvShows"
		};
		var MusicVideos = {
			"jsonrpc": "2.0",
			"method": "VideoLibrary.GetMusicVideos",
			"params": {
				"properties": ["title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails"],
				"sort": {
					"order": "ascending",
					"method": "artist",
					"ignorearticle": true
				}
			},
			"id": "libMusicVideos"
		};
		var AudioPlaylist = {
			"jsonrpc": "2.0",
			"method": "Playlist.GetItems",
			"params": {
				"properties": ["title", "album", "artist", "duration"],
				"playlistid": 0
			},
			"id": 1
		};
		var VideoPlaylist = {
			"jsonrpc": "2.0",
			"method": "Playlist.GetItems",
			"params": {
				"properties": ["runtime", "showtitle", "season", "title", "artist"],
				"playlistid": 1
			},
			"id": 1
		};

		// Do WordPress ajax here
		// http://stackoverflow.com/a/10360054
		var ajaxurl = '/wp-admin/admin-ajax.php';
		var data = {
			'action': 'kodi',
			'endpoint': encodeURIComponent(JSON.stringify(Movies))
		};
		$.post(ajaxurl, data, function (wpResponse) {
			var obj = jQuery.parseJSON(wpResponse);
			console.log(obj);

			/**
			 * Get the full list of genres
			 */
			var moviesGenre = [];
			var moviesGenreAll = $.map(obj.result.movies, function (val, key) {
				return val.genre;
			});
			$.each(moviesGenreAll, function (i, el) {
				if ($.inArray(el, moviesGenre) === -1) moviesGenre.push(el);
			});
			$.each(moviesGenre, function (i) {
				var btn = $('<button/>')
					.text(moviesGenre[i])
					.attr({
						'type': 'button',
						'data-filter': '.' + moviesGenre[i]
					})
					.addClass('btn btn-default filter')
					.appendTo($('#movies-genres'));
			});

			/*
			Compile into handlebars template
			 */
			var getTemplate = $('#movies-template').html(),
				template = Handlebars.compile(getTemplate),
				result = template(obj.result);
			$('#movies').html(result);
			$('body').removeClass('loading');

			/*
			Execute jQuery plugins
			 */
			$('#movies').mixItUp({
				selectors: {
					target: '.movie'
				},
				callbacks: {
					onMixLoad: function (state) {
						console.log('MixItUp ready!');
						$('.movies-filtersort').fadeIn();
						$('img.lazy').lazyload();
					},
					onMixStart: function (state, futureState) {
						$('.search-status').html('Searching movies...');
					},
					onMixEnd: function (state) {
						/**
						 * Count the amount of movies depending on filters, genre, etc
						 */
						var count = $('.movies-list>.movie:visible').length;
						$('.search-status').html(count + ' movies found...');
					}
				},
				controls: {
					toggleFilterButtons: true,
					toggleLogic: 'and'
				}
			});
		});

		/*
		Handlebars helpers
		 */
		Handlebars.registerHelper('getImgSrc', function (thumbnail) {
			var decodeURL = decodeURIComponent(thumbnail),
				cleanURL = decodeURL.replace('image://', '');
			return new Handlebars.SafeString(cleanURL);
		});
		Handlebars.registerHelper('round', function (options) {
			return new Handlebars.SafeString(
				Math.round(options * 100) / 100
			);
		});
		Handlebars.registerHelper('formatTime', function (secs) {
			var hours = Math.floor(secs / (60 * 60));
			var divisor_for_minutes = secs % (60 * 60);
			var minutes = Math.floor(divisor_for_minutes / 60);
			return hours + ':' + minutes;
		});
		Handlebars.registerHelper('status', function (playedStatus) {
			if (playedStatus === 0) {
				return 'played-no';
			} else {
				return 'played-yes';
			}
		});

		/**
		 * Boostrap Modals
		 */
		$('#movie-details').on('show.bs.modal', function (event) {

			var modal = $(this);
			var button = $(event.relatedTarget);
			var title = button.data('title');
			var plot = button.data('plot');
			var file = button.data('file');
			var genre = button.data('genre');
			var ret = genre.split(',');
			var list = modal.find('.modal-body > .movie-genre');

			$.each(ret, function (i) {
				var span = $('<span/>')
					.text(ret[i])
					.addClass('label label-primary')
					.appendTo(list);
			});
			modal.find('.modal-title').text(title);
			modal.find('.modal-body > .movie-plot').html(plot);

			$('#movie-play').on('click', function (event) {
				event.preventDefault();
				// Play a single video from file
				var urlPlay = 'http://192.168.1.102:8080/jsonrpc?request={"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"file":"' + file + '"}}}';
				location.href = urlPlay;
			});
		});

	});

})(jQuery);