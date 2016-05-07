(require 'ox-publish)

(setq org-publish-project-alist
      '(
        ("blog-org"
         ;; Path to your org files.
         :base-directory "~/blog/src/"
         :base-extension "org"

         ;; Path to your Jekyll project.
         :publishing-directory "~/blog/jekyll/"
         :recursive t
         :publishing-function org-html-publish-to-html
         :headline-levels 4
         :html-extension "html"
         :html-doctype "html5"
         :html-html5-fancy t
         :with-toc nil; No table of contents
         :body-only t ;; Only export section between <body> </body>
         )

        ("blog-static"
         :base-directory "~/blog/src"
         :base-extension "html\\|css\\|scss\\|js\\|png\\|jpg\\|ico\\|gif\\|pdf\\|mp3\\|ogg\\|swf\\|php"
         :publishing-directory "~/blog/jekyll"
         :recursive t
         :publishing-function org-publish-attachment)

        ("blog" :components ("blog-org" "blog-static"))
        )
    )

(org-publish "blog")