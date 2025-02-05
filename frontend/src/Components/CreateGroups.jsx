import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input  } from '@nextui-org/react'
import React, { useEffect, useState }   from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchFriends } from '../features/authentication/ProfileSlice'
import {Select, SelectItem} from "@nextui-org/react";

const CreateGroups = ({setChanged}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [groupName, setGroupName] = useState('')
    const [description, setDescription] = useState('')
    const {access} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const {friends_list} = useSelector((state) => state.profile)
    const [selectedFriends, setSelectedFriends] = useState([])
    const dispatch = useDispatch()
useEffect(() => {
    dispatch(fetchFriends())
    console.log('dj')
    console.log(friends_list,'friend_list')
}, [access])
    const handleCreateGroup = async () => {
        console.log(groupName, description, selectedFriends)
        const userIds=selectedFriends.map((friend) => friend.user_id)
        console.log(userIds)
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/`, {
                name: groupName,
                description: description,
                user_ids: userIds,
                
            },{
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            console.log(response.data)
            setChanged((prev) => !prev)
            setLoading(false)
            setGroupName('')
            setDescription('')
            setSelectedFriends([])
            onOpenChange()

        } catch (error) {
            console.error('Error creating group:', error)
        }
        
    }

  return (
    <div>
       
       
        <Button className="hidden items-center gap-2 self-start rounded-2xl border-b-4 border-green-500 bg-green-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110 md:flex" onClick={onOpen}>Create Group</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>
                    <h1 className='text-2xl font-bold'>Create Group</h1>
                </ModalHeader>
                <ModalBody>
                    <Input label='Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    <Input label='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Select
      label="Group Members"
      placeholder="Select friends"
      selectionMode="multiple"
      className="max-w-xs"
    >
      {friends_list.map((friend) => (
        <SelectItem key={friend.id} onClick={() => setSelectedFriends([...selectedFriends, friend])}>
          {friend.username}
        </SelectItem>

      ))}
    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onOpenChange}>Cancel</Button>
                    <Button onClick={handleCreateGroup} isLoading={loading}>Create</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default CreateGroups