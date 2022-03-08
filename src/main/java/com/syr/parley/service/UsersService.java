package com.syr.parley.service;

import com.syr.parley.domain.Users;
import com.syr.parley.repository.UsersRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public Users createUsers(Users users) {
        return usersRepository.save(users);
    }

    public Optional<Users> getUsersById(Long id) {
        return usersRepository.findById(id);
    }

    public Optional<Users> getUsersByIdWithRelationships(Long id) {
        return usersRepository.findOneWithEagerRelationships(id);
    }

    //public List<Users> getAllUsers() {
    //    return usersRepository.findAllWithEagerRelationships();
    //}

    public Optional<Users> updateUsers(Users users) {
        return usersRepository
            .findById(users.getId())
            .map(existingUsers -> {
                if (users.getFirstName() != null) {
                    existingUsers.setFirstName(users.getFirstName());
                }
                if (users.getLastName() != null) {
                    existingUsers.setLastName(users.getLastName());
                }

                return existingUsers;
            })
            .map(usersRepository::save);
    }

    public void deleteUsers(Long id) {
        usersRepository.deleteById(id);
    }
}
