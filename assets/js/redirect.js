(function () {
	if ( typeof brizyExitRedirect === 'undefined' || ! brizyExitRedirect.permalink ) {
		return;
	}

	var permalink = brizyExitRedirect.permalink;

	function hijackDashboardLink( node ) {
		var links = ( node.querySelectorAll ? node : document ).querySelectorAll( 'a' );
		links.forEach( function ( link ) {
			var text = ( link.textContent || '' ).trim().toLowerCase();
			if ( text === 'go to dashboard' || text === 'dashboard' ) {
				if ( link.dataset.brizyRedirected ) {
					return;
				}
				link.dataset.brizyRedirected = '1';
				link.setAttribute( 'href', permalink );
				link.addEventListener( 'click', function ( e ) {
					e.preventDefault();
					e.stopPropagation();
					window.location.href = permalink;
				}, true );
			}
		});
	}

	// Run immediately for any existing links.
	hijackDashboardLink( document );

	// Watch for dynamically added elements (Brizy renders menus on demand).
	var observer = new MutationObserver( function ( mutations ) {
		mutations.forEach( function ( mutation ) {
			mutation.addedNodes.forEach( function ( node ) {
				if ( node.nodeType === 1 ) {
					hijackDashboardLink( node );
				}
			});
		});
	});

	observer.observe( document.body || document.documentElement, {
		childList: true,
		subtree: true,
	});

	// Also intercept inside iframes that Brizy may use for the editor UI.
	function observeIframes() {
		document.querySelectorAll( 'iframe' ).forEach( function ( iframe ) {
			if ( iframe.dataset.brizyObserved ) {
				return;
			}
			iframe.dataset.brizyObserved = '1';
			try {
				var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				hijackDashboardLink( iframeDoc );
				var iframeObserver = new MutationObserver( function ( mutations ) {
					mutations.forEach( function ( mutation ) {
						mutation.addedNodes.forEach( function ( node ) {
							if ( node.nodeType === 1 ) {
								hijackDashboardLink( node );
							}
						});
					});
				});
				iframeObserver.observe( iframeDoc.body || iframeDoc.documentElement, {
					childList: true,
					subtree: true,
				});
			} catch ( e ) {
				// Cross-origin iframe; skip.
			}
		});
	}

	// Periodically check for new iframes.
	setInterval( observeIframes, 2000 );
	observeIframes();
})();
