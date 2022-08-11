import React, { useState,useEffect } from "react";
import propTypes from "prop-types";
import { paginate } from "../utils/paginate";
import Pagination from "./pagination";
import API from "../api";
import GroupList from "./groupList";
import SearchStatus from "./searchStatus";
import UserTable from "./usersTable";

const Users = ({ users: allUsers, ...rest }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [professions,setProfession] = useState(API.professions.fetchAll())
    const [selectedProf,setSelectedProf] = useState()
    
    const pageSize = 4;

    useEffect(()=>{
        setCurrentPage(1); 
    },[selectedProf])

    useEffect(() => {
        API.professions.fetchAll().then((data) => setProfession(data))
    }, []); 

    const handleProfessionsSelect = (item) => {
        setSelectedProf(item)
    } 

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const handleSort = (item) => {
        console.log(item);
    }

    const filteredUsers = selectedProf ? allUsers.filter((user)=> user.profession.name === selectedProf.name)
    :allUsers;
    const count = filteredUsers.length? 
    filteredUsers.length
    : Object.keys(filteredUsers).length;
    const usersCrop = paginate(filteredUsers, currentPage, pageSize);
    const clearFilter = () => {
        setSelectedProf();  
    }
    return (
        <div className="d-flex">
            {professions &&
            <div className="d-flex flex-column flex-shrink-0 p-3">
                <GroupList 
                selectedItem = {selectedProf}
                items={professions} 
                onItemSelect = {handleProfessionsSelect}
                />
                <button className="btn btn-secondary mt-2" onClick={clearFilter}>Очистить</button>
            </div>
                }
            <div className="d-flex flex-column">
                <SearchStatus length={count} />
                {count > 0 && (
                    <UserTable users={usersCrop} {...rest} onSort={handleSort}/>
                )}
                <div className="d-flex justify-content-center">
                    <Pagination
                    itemsCount={count}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};
Users.propTypes = {
    users: propTypes.oneOfType([propTypes.object, propTypes.array])
    // users : propTypes.object.isRequired,
};

export default Users;
