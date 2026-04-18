package com.aquatrade.core.service.impl;

import com.aquatrade.core.dto.CMSPostDto;
import com.aquatrade.core.repository.CMSPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CMSPostServiceImpl {

    private final CMSPostRepository cmsPostRepository;

    public List<CMSPostDto> getAllPosts() {
        return Collections.emptyList(); // TODO: Mở rộng ánh xạ DTO
    }

    public CMSPostDto createPost(CMSPostDto dto) {
        return dto; // TODO: Mở rộng ánh xạ và lưu DB
    }
}
