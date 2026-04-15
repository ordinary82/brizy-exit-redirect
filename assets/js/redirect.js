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
				link.textContent = 'View Live Page';
				link.addEventListener( 'click', function ( e ) {
					e.preventDefault();
					e.stopPropagation();
					var targetWindow = ( link.ownerDocument.defaultView || window.top );
					targetWindow.location.href = permalink;
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

	// Also hijack the "Go to Dashboard" link in the parent document (Brizy
	// renders the editor chrome in the parent frame while this script runs
	// inside the editor iframe).
	function observeParent() {
		try {
			if ( window.parent && window.parent.document !== document ) {
				hijackDashboardLink( window.parent.document );
				var parentObserver = new MutationObserver( function ( mutations ) {
					mutations.forEach( function ( mutation ) {
						mutation.addedNodes.forEach( function ( node ) {
							if ( node.nodeType === 1 ) {
								hijackDashboardLink( node );
							}
						});
					});
				});
				var parentBody = window.parent.document.body || window.parent.document.documentElement;
				if ( parentBody ) {
					parentObserver.observe( parentBody, {
						childList: true,
						subtree: true,
					});
				}
			}
		} catch ( e ) {
			// Cross-origin parent; skip.
		}
	}

	setInterval( observeParent, 2000 );
	observeParent();
})();
