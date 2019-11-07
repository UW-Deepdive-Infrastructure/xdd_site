import React, {createContext, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import {InputGroup, NonIdealState} from "@blueprintjs/core"

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.APIResultView
}

const APIResultView = dynamic(loadCard, { ssr: false });

//const Journals = () => {
//  return <BasePage title="journal search">
//    <p>xDD journal holdings</p>
//  </BasePage>
//}

function renderResponse(res) {
  if (res.success == null) {
    return <NonIdealState title={"No results"} icon="search" />
  }
  const {data} = res.success;
  return <ul className="papers">{data.map(paper => {
      return <div><Link href={`/article/${paper._gddid}`}><a><Swatch data={paper} /></a></Link></div>
  })}</ul>
}

const LoginContext = createContext({user: "Guest"});

const SearchHandler = (props)=>{
  const {searchString} = props;
  let titleLike = null;
  if (searchString == null) return null
  if (searchString.length > 3) {
    titleLike = searchString;
  }
  if (titleLike != null) {
    return <APIResultView
      route="https://geodeepdive.org/api/journals"
      params={{journal_like: titleLike, max: 10}}
      debounce={1000}
    / >
  }
  return <NonIdealState icon="alert" title="Document results">
    Search for documents
  </NonIdealState>
}

class Journals extends Component {
  static contextType = LoginContext;
  constructor(props) {
    super(props);
    this.state = {
      searchString: null
    }
    this.updateSearchString = this.updateSearchString.bind(this)
  }
  render() {
    const {user} = this.context;
    return <BasePage title="journal search">
      <InputGroup
        className="main-search"
        placeholder="Search for journals in the xDD corpus."
        leftIcon="search"
        large
        value={this.state.searchString}
        onChange={this.updateSearchString}
      />
      <SearchHandler searchString={this.state.searchString} />
    </BasePage>
  }

  updateSearchString(evt) {
    this.setState({searchString: evt.target.value})
  }
}

export default Journals
