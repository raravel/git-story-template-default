window.$sbarOpen = document.querySelector('#sidebar-open');
window.$sbarClose = document.querySelector('#sidebar-close');
window.$sbar = document.querySelector('#sidebar');
window.$listApp = document.querySelector('#list-app');
window.$postApp = document.querySelector('#post-app');

String.prototype.lastChar = function() {
	return this[this.length-1];
};

const switchDisplay = (mode = "list") => {
	if ( mode === "list" ) {
		$listApp.style.display = "flex";
		$postApp.style.display = "none";
	} else if ( mode === "post" ) {
		$listApp.style.display = "none";
		$postApp.style.display = "flex";
	}
};

$sbarOpen.addEventListener('click', (e) => {
	$sbar.classList.remove('hidden');
	$sbarClose.classList.remove('hidden');
	$sbarOpen.classList.add('hidden');
});

$sbarClose.addEventListener('click', (e) => {
	$sbar.classList.add('hidden');
	$sbarClose.classList.add('hidden');
	$sbarOpen.classList.remove('hidden');
});

const createCategory = (item) => {
	if ( typeof item !== "object" ) return;

	let categoryDiv = document.createElement('div');

	let Categorys = Object.keys(item);
	Categorys.forEach(name => {
		let c = item[name];

		let div = document.createElement('div');
		div.className = "relative -mx-2 w-24 mb-2";

		let a = document.createElement('a');
		let pslash = c.href.lastChar() === "/" ? "" : "/";
		a.href = `/?c=${c.href}${pslash}`;

		let h5 = document.createElement('h5');
		h5.className = "mb-3 lg:mb-2 text-gray-700 upupercase tracking-wide text-base hover:text-red-400";
		h5.innerText = name;

		a.appendChild(h5);
		div.appendChild(a);
		if ( c.single === true ) {
		} else {
			let subItem = c.posts;
			let SubCategorys = Object.keys(c.posts);
			let ul = document.createElement('ul');
			SubCategorys.forEach(sname => {
				let sc = subItem[sname];

				let li = document.createElement('li');
				li.className = "mb-3 lg:mb-1";

				let a = document.createElement('a');
				a.className = "px-2 pl-6 -mx-2 py-1 transition-fast relative block hover:translate-r-2px hover:text-red-500 text-gray-600 font-medium cursor-pointer";
				let spslash = sc.href.lastChar() === "/" ? "" : "/";
				a.href = `/?c=${sc.href}${spslash}`;
				a.innerHTML = 
				`<span class="rounded absolute inset-0 bg-teal-200 opacity-0"></span>
				<span class="relative">${sname}</span>`;

				li.appendChild(a);
				ul.appendChild(li);
			});
			div.appendChild(ul);
		}

		categoryDiv.appendChild(div);
	});
	return categoryDiv;
};

const searchObject = (obj, key, value) => {
	let keys = Object.keys(obj);
	let len = keys.length;

	if ( !value ) return obj;

	for ( let i=0;i<len;i++ ) {
		let k = keys[i];
		if ( k === key ) {
			if ( obj[k] == value ) {
				return obj;
			}
		}
		if ( typeof obj[k] === "object" ) {
			let rtn = searchObject(obj[k], key, value);
			if ( typeof rtn === "object" ) {
				return rtn;
			}
		}
	};
};

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const getSubposts = (obj) => {
	let rtn = [];
	if ( Array.isArray(obj.posts) ) {
		return obj.posts;
	}

	let target = obj;
	if ( typeof obj.posts === "object" ) {
		target = obj.posts; 
	}

	let keys = Object.keys(target);
	keys.forEach(k => {
		if ( typeof target[k] === "object" ) {
			rtn = rtn.concat(getSubposts(target[k]));
		}
	});
	return rtn;
};

const getContent = (url, callback = () => {}) => {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'text';
	xhr.onreadystatechange = (e) => {
		if ( xhr.readyState === 4 ) {
			if ( xhr.status === 200 ) {
				callback(xhr.responseText);
			}
		}
	};
	xhr.send(null);
};

const createPostList = (posts) => {
	let tp = posts;
	if ( location.search !== "" ) {
		// category 는 c 를 사용합니다.
		let v = getParameterByName('c'); 
		tp = searchObject(posts, 'href', v); 
	}
	let p = getSubposts(tp);

	if ( Array.isArray(p) ) {
		let postsDiv = document.createElement('div');
		p.forEach(post => {
			let a = document.createElement('a');
			//a.href = `/posting.html?v=${post.href}index.html`;
			let pslash = post.href.lastChar() === "/" ? "" : "/";
			a.href=`/?v=${post.href}${pslash}`;
			a.className = "md:flex bg-white p-6 cursor-pointer hover:bg-gray-200";

			let div = document.createElement('div');
			div.className = "text-left";

			let img = document.createElement('img');
			img.className = "h-32 w-32 mx-auto md:mx-0 md:mr-6";
			img.src = post.cover;

			let h2 = document.createElement('h2');
			h2.className = "text-xl font-bold";
			h2.innerText = post.title;

			let create = (() => {
				let m = post.href.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}/g);
				if ( m ) {
					let s = m[0].split('-');
					if ( s.length === 6 ) {
						return `${s[0]}. ${s[1]}. ${s[2]} ${s[3]}:${s[4]}:${s[5]}`;
					}
				}
			})();
			let cspan = document.createElement('div');
			cspan.className = "text-red-300";
			cspan.innerText = create;

			let pspan = document.createElement('div');
			pspan.className = "text-gray-600";

			getContent(post.href+'index.html', (res) => {
				let tmpDiv = document.createElement('div');
				tmpDiv.innerHTML = res;

				let content = tmpDiv.querySelector('main');
				pspan.innerText = content.innerText.replace(/\r\n/g, '').replace(/\n/g, '');
			});

			div.appendChild(h2);
			div.appendChild(cspan);
			div.appendChild(pspan);
			a.appendChild(img);
			a.appendChild(div);
			
			postsDiv.appendChild(a);
		});
		return postsDiv;
	}
};

const getPosts = (callback = () => {}) => {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/posts.json');
	xhr.responseType = "json";
	xhr.onreadystatechange = (e) => {
		if ( xhr.readyState === 4 ) {
			if ( xhr.status === 200 ) {
				callback(xhr.response);
			}
		}
	};
	xhr.send(null);
};

getPosts((posts) => {
	let category = createCategory(posts);	
	document.querySelector('#category-nav').appendChild(category);

	let url = getParameterByName('v');
	if ( url ) {
		switchDisplay('post');

		let path = url.replace(/index$|index\.html$/g, '');

		let p = searchObject(posts, 'href', path);
		if ( p ) {
			let header = document.querySelector('#post-app #content-header');
			header.querySelector('h1').innerText = p.title;

			let create = (() => {
				let m = path.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}/g);
				if ( m ) {
					let s = m[0].split('-');
					if ( s.length === 6 ) {
						return `${s[0]}. ${s[1]}. ${s[2]} ${s[3]}:${s[4]}:${s[5]}`;
					}
				}
			})();
			header.querySelector('h4>span:last-child').innerText = create;

			let realContent = document.querySelector('#real-content');
			realContent.onload = () => {
				realContent.height = realContent.contentDocument.scrollingElement.scrollHeight;
			};

			if ( url.match(/index$|index\.html$/) ) {
				// do not anyting.
			} else {
				if ( url[url.length-1] === '/' ) {
					url += "index";
				} else {
					url += "/index";
				}
			}
			realContent.src = url;
			/*
			getContent(url, (res) => {
				document.querySelector('#real-content').innerHTML = res;
			});
			*/
		}
	} else {
		switchDisplay('list');
		let postsList = createPostList(posts);
		console.log(postsList);
		if ( postsList ) {
			document.querySelector('#list-app>div').appendChild(postsList);
		}
	}
});
