@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination Navigation" class="pagination-nav">
        <div class="pagination-mobile mono">
            @if ($paginator->onFirstPage())
                <span class="pagination-btn is-disabled">Previous</span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="pagination-btn">Previous</a>
            @endif
            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="pagination-btn">Next</a>
            @else
                <span class="pagination-btn is-disabled">Next</span>
            @endif
        </div>

        <div class="pagination-desktop">
            <p class="pagination-info mono">
                {!! __('Showing') !!}
                @if ($paginator->firstItem())
                    <span class="is-strong">{{ $paginator->firstItem() }}</span>
                    {!! __('to') !!}
                    <span class="is-strong">{{ $paginator->lastItem() }}</span>
                @else
                    {{ $paginator->count() }}
                @endif
                {!! __('of') !!}
                <span class="is-strong">{{ $paginator->total() }}</span>
                {!! __('results') !!}
            </p>

            <span class="pagination-links mono" role="list">
                {{-- Previous --}}
                @if ($paginator->onFirstPage())
                    <span aria-disabled="true" aria-label="{{ __('pagination.previous') }}" class="pagination-arrow is-disabled" role="listitem">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="display:block">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                @else
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="{{ __('pagination.previous') }}" class="pagination-arrow" role="listitem">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="display:block">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </a>
                @endif

                @foreach ($elements as $element)
                    @if (is_string($element))
                        <span aria-disabled="true" class="pagination-ellipsis" role="listitem"><span class="pagination-page is-ellipsis">{{ $element }}</span></span>
                    @endif
                    @if (is_array($element))
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <span aria-current="page" role="listitem"><span class="pagination-page is-active">{{ $page }}</span></span>
                            @else
                                <a href="{{ $url }}" class="pagination-page" aria-label="{{ __('Go to page :page', ['page' => $page]) }}" role="listitem">{{ $page }}</a>
                            @endif
                        @endforeach
                    @endif
                @endforeach

                {{-- Next — this is the arrow you flagged --}}
                @if ($paginator->hasMorePages())
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="{{ __('pagination.next') }}" class="pagination-arrow" role="listitem">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="display:block">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </a>
                @else
                    <span aria-disabled="true" aria-label="{{ __('pagination.next') }}" class="pagination-arrow is-disabled" role="listitem">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="display:block">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                @endif
            </span>
        </div>
    </nav>
@endif
