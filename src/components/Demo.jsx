import {useState,useEffect} from 'react'
import {copy,linkIcon,loader,tick} from '../assets'
import {useLazyGetSummaryQuery} from '../services/article'



const Demo = () => {
    const [ article, setArticle] = useState({
      url:'',
      summary:'',
    })
    const [allArticles,setAllArticles]= useState([])
    const [copied, setCopied] = useState("")

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

      useEffect(() => {
        const articlesFromLocalStorage = JSON.parse(
          localStorage.getItem("articles")
        );  
        
        if (articlesFromLocalStorage) {
          setAllArticles(articlesFromLocalStorage);
        }
      }, []);
    const handleSubmit =async (e)=>{
      e.preventDefault()
      
      const {data}=await getSummary({articleUrl:article.url})

      if(data?.summary){
        const newArticle={...article,summary:data.summary}

        const updatedAllArticles=[newArticle,...allArticles]
        
        setArticle(newArticle)
        setAllArticles(updatedAllArticles)

        localStorage.setItem("articles",JSON.stringify(updatedAllArticles))

        console.log(newArticle);
      }
    }
    const handleCopy = (copyUrl) => {
      if (copied === copyUrl) {
        setCopied(""); // If it's the same URL, unmark it as copied.
      } else {
        setCopied(copyUrl); // Mark this URL as copied.
        navigator.clipboard.writeText(copyUrl);
        setTimeout(() => setCopied(""), 3000);
      }
    };
    
  return (
    <div>
      <section className='mt-16 w-full max-w-xl'>
        {/* Search */}
        <div className="flex flex-col w-full gap-2">
          <form 
          action="" 
          className="relative flex justify-center items-center" 
          onSubmit={handleSubmit}>
            <img 
            src={linkIcon} 
            alt="linkIcon"
            className='absolute left-0 my-2 ml-3 w-5'
            />
            <input 
            type="url"
            placeholder='Enter your URL' 
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="block w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-12 text-sm shadow-lg font-satoshi font-medium focus:border-black focus:outline-none focus:ring-0; 
            peer-focus:border-gray-700 peer-focus:text-gray-700 "/>
            <button type='submit' className='submit_btn'>
            ↵
            </button>
          </form>
          {/* Browser URL History */}
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item,index)=>(
            <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className='link_card'
            >
              <div className="copy_btn" onClick={()=>{handleCopy(item.url)}}>
                <img 
                src={copied===item.url? tick:copy} 
                alt="copy"
                className="w-[48%] h-[40%] object-contain" />
              </div>  
              <p className='flex-1  text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
          </div>
        </div>
        {/* Display Results*/}
              <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt="loader" className='h-20 w-20 object-contain' />
        ) : error? (
          <p className='font-inter font-bold text-black'>
            Well,that wasn&apos;t supposed to happen...
            <br />
            <span className='font-satoshi font-normal'>
              {error?.data?.error}
            </span>
          </p>
        ):(
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-bold text-gray-600 text-xl'>Article <span className='blue_gradient'>Summary</span></h2>
              <div className='summary_box'>
              <p className=' font-inter font-medium text-sm text-gray-700'>
                {article.summary}
              </p>
              </div>
            </div>
          )
        )}
      </div>
      </section>
    </div>
  )
}

export default Demo