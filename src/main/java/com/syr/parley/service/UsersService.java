package com.syr.parley.service;

import com.syr.parley.domain.Users;
import com.syr.parley.repository.UserRepository;
import com.syr.parley.repository.UsersRepository;
import com.syr.parley.service.dto.UsersDisplayDTO;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;
    private final UserRepository userRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository, UserRepository userRepository) {
        this.usersRepository = usersRepository;
        this.userRepository = userRepository;
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

    public List<UsersDisplayDTO> getAllPublicUsers() {
        return userRepository
            .findAll()
            .stream()
            .filter(user -> user.getId() != 1 && user.getId() != 2)
            .map(UsersDisplayDTO::new)
            .collect(Collectors.toList());
    }

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
