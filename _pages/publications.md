---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% assign primary_publications = site.publications | where: "primary_author", true %}
<h2 class="archive__subtitle publication-group-title">First- and Corresponding-Author Publications</h2>
{% for post in primary_publications reversed %}
  {% include archive-single.html %}
{% endfor %}

{% assign collaborative_publications = site.publications | where: "primary_author", false %}
{% if collaborative_publications.size > 0 %}
  <h2 class="archive__subtitle publication-group-title">Collaborative Publications</h2>
  {% for post in collaborative_publications reversed %}
    {% include archive-single.html %}
  {% endfor %}
{% endif %}

{% include wechat-share-modal.html %}
