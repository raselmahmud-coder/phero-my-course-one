document.getElementById('current-year').textContent = new Date().getFullYear();

// URL of the RSS feed
const feedUrl = "https://programming-dude.com/rss.xml";

// Using a CORS proxy to bypass CORS restrictions
const proxyUrl =
  "https://api.allorigins.win/get?url=" + encodeURIComponent(feedUrl);

// Fetch the RSS feed via the proxy
fetch(proxyUrl)
  .then((response) => response.json())
  .then((data) => {
    const xmlString = data.contents; // The raw XML content from the feed
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Get the latest 3 posts
    const items = xmlDoc.getElementsByTagName("item");
    const posts = [];

    // Loop through the items and extract the title, link, description, and cover image
    for (let i = 0; i < 3; i++) {
      const title = items[i].getElementsByTagName("title")[0].textContent;
      const link = items[i].getElementsByTagName("link")[0].textContent;
      const description =
        items[i].getElementsByTagName("description")[0].textContent;

      // Clean up CDATA content (if any)
      const cleanDescription = description
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
        .trim();

      // Get the cover image URL from hashnode:coverImage
      let coverImageUrl = "";
      const coverImageElement = items[i].getElementsByTagName(
        "hashnode:coverImage",
      )[0];
      if (coverImageElement) {
        coverImageUrl = coverImageElement.textContent; // Extract the URL from <hashnode:coverImage>
      }

      // Push post data to posts array
      posts.push({ title, link, description: cleanDescription, coverImageUrl });
    }
    // Display the latest 3 posts on the webpage
    const postsContainer = document.getElementById("latest_post");
    // Clear existing placeholders
    postsContainer.innerHTML = "";
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className =
        "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md card-hover";
      postElement.innerHTML = `
          <img src="${post.coverImageUrl}" alt=${post.title} srcset="${post.coverImageUrl}">
          <h3 class="text-xl font-semibold my-4">${post.title}</h3>
          <p class="my-4">${post.description}</p>
          <a href="${post.link}"
            target="_blank" class="text-primary dark:text-primary-dark hover:underline hover-transition">View Blog
            →</a>
            `;
      postsContainer.appendChild(postElement);
    });
  })
  .catch((error) => {
    console.error("Failed to fetch the RSS feed:", error);
  });
