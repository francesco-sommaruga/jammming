import React from 'react'
import './SearchBar.css'

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: window.localStorage.getItem('searchTerm') ? window.localStorage.getItem('searchTerm') : ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(e) {
        window.localStorage.setItem('searchTerm', e.target.value);
        this.setState({searchTerm: e.target.value});
    }

    render() {
        return (
            <div className="SearchBar">

                <input 
                placeholder="Enter A Song, Album, or Artist"
                value={this.state.searchTerm}
                onChange={this.handleTermChange}                    
                />

                <button
                className="SearchButton"
                onClick={this.search}
                >SEARCH</button>
            </div>
        )
    }
}