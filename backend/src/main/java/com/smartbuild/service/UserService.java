package com.smartbuild.service;

import com.smartbuild.dto.request.UserUpdateRequest;
import com.smartbuild.dto.response.UserResponse;
import com.smartbuild.entity.User;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.UserMapper;
import com.smartbuild.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + id
                ));

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse update(UUID id, UserUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + id
                ));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setActive(request.getActive());

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + id
                ));

        userRepository.delete(user);
    }
}