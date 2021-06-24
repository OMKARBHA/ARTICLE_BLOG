const express=require('express')
const router= express.Router()
const Article= require('./../models/articledb')

router.get('/create_article',function(req,res){
    res.render('articles/create_articles', {articles : new Article})
})

router.get('/edit/:id', async (req, res) => {
    const article= await  Article.findById(req.params.id)
        if(article==null) res.redirect('/')
        res.render('articles/edit',{articles: article })
              
})

router.get('/:slug', async (req, res) => {
    const article= await  Article.findOne({slug: req.params.slug})
        if(article==null) res.redirect('/')
        res.render('articles/show',{articles: article })
              
})

router.post('/',async (req,res,next)=>{
    req.article= new Article()
    next()
},saveArticleAndRedirect('create_articles'))

router.put('/:id',async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
  next()
},saveArticleAndRedirect('edit'))

router.delete('/:id', async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})



function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { articles: article })
      }
    }
  }

module.exports = router


